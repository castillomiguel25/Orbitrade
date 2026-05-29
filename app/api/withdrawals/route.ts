// imports and configuration
import { NextResponse } from "next/server";
import { createClient } from "../../utils/supabase/server";
import { v4 as uuidv4 } from "uuid";
import { WITHDRAWAL_MIN_AMOUNT, WITHDRAWAL_FEE_PERCENT } from "@/app/constants/withdrawal";
import { checkRateLimit, RATE_LIMITS } from "../../utils/rateLimit";
import { verifyWithdrawalKey } from "@/app/modules/withdrawals";

export const runtime = "nodejs";

// POST - Create withdrawal
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 (Dom) a 6 (Sab)
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return NextResponse.json({ error: "withdrawals_weekend_blocked" }, { status: 400 });
  }

  // Rate limiting: max 3 req/min per user
  const rl = checkRateLimit(`withdrawals:${user.id}`, RATE_LIMITS.withdrawals);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.resetMs / 1000)) } }
    );
  }

  const body = await request.json();
  const { amount, trc20address, network, claveRetiro } = body;

  const userId = user.id;
  const userEmail = user.email;

  const numericAmount = parseFloat(amount);
  if (!numericAmount || numericAmount <= 0) {
    return NextResponse.json({ error: "Monto inválido" }, { status: 400 });
  }

  const SPECIAL_MIN_USERS = new Set([
    'miguelangelcastillocolmenares@gmail.com',
    'dtfranciscoj27@gmail.com',
    'dtfranciscoj27gmail.com',
    'mmilrichs@gmail.com',
  ]);
  const minAmount = SPECIAL_MIN_USERS.has((userEmail || '').toLowerCase()) ? 10 : WITHDRAWAL_MIN_AMOUNT;
  if (numericAmount < minAmount) {
    return NextResponse.json({ error: `Monto mínimo de retiro: ${minAmount} USDT` }, { status: 400 });
  }

  // Obtener el balance actual del usuario, flujo y clave de retiro
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("trc20balance, flujo, withdrawalkey")
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: "No se pudo obtener el perfil" }, { status: 500 });
  }

  // Verify withdrawal key before touching balance
  if (!verifyWithdrawalKey(claveRetiro || '', profile.withdrawalkey || '')) {
    return NextResponse.json({ error: "invalid_withdrawal_key" }, { status: 403 });
  }

  const currentBalance = parseFloat(profile.trc20balance);
  const flowAmount = parseFloat(profile.flujo || "0");
  if (numericAmount > currentBalance) {
    return NextResponse.json({ error: "Fondos insuficientes" }, { status: 400 });
  }

  // --- Lógica de Comisión Dinámica ---
  // Calcular inicio de la semana actual (Lunes 00:00:00)
  const day = now.getDay(); // 0 (Dom) a 6 (Sab)
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Ajustar para que sea Lunes
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);

  // Contar retiros realizados desde el lunes
  const { count: weeklyCount, error: countError } = await supabase
    .from("withdrawals")
    .select("*", { count: 'exact', head: true })
    .eq("uid", userId)
    .gte("timestamp", monday.toISOString());

  if (countError) {
    console.error("Error contando retiros semanales:", countError);
  }

  const currentCount = weeklyCount || 0;
  let feePercent = 10; // Default 1ra vez

  if (currentCount === 1) {
    feePercent = 15; // 2da vez
  } else if (currentCount >= 2) {
    feePercent = 20; // 3ra vez o más
  }

  // Si el flujo es mayor a 0, sumar 20% adicional
  if (flowAmount > 0) {
    feePercent += 20;
  }
  // --- Fin Lógica de Comisión ---

  const fee = parseFloat((numericAmount * (feePercent / 100)).toFixed(2));
  const finalamount = parseFloat((numericAmount - fee).toFixed(2));

  // Validar red seleccionada y normalizar
  const allowedNetworks = new Set(["TRC20", "APTOS", "ARBITRUM ONE"]);
  const requestedNetwork = typeof network === 'string' ? network.toUpperCase() : 'TRC20';
  const bankDetails = allowedNetworks.has(requestedNetwork) ? requestedNetwork : 'TRC20';

  // Insertar el retiro
  const { error: insertError } = await supabase.from("withdrawals").insert({
    id: crypto.randomUUID(),
    uid: userId,
    email: userEmail,
    amount: numericAmount,
    finalamount,
    fee,
    trc20address,
    bank_details: bankDetails,
    timestamp: new Date().toISOString(),
    new_id: crypto.randomUUID(),
    is_processed: false,
  });

  if (insertError) {
    return NextResponse.json({ error: "Error al registrar retiro" }, { status: 500 });
  }

  const nuevoBalance = currentBalance - numericAmount;

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ trc20balance: nuevoBalance })
    .eq("id", userId);

  if (updateError) {
    return NextResponse.json({ error: "Error al actualizar balance" }, { status: 500 });
  }

  // Registrar movimiento de saldo (retiro)
  await supabase.from("balance_movements").insert({
    user_id: userId,
    type: "withdraw",
    amount: -numericAmount,
    previous_balance: currentBalance,
    new_balance: nuevoBalance,
    ref_id: trc20address || null,
    note: "Retiro solicitado",
    metadata: { feePercent: feePercent, fee, finalamount, network: bankDetails },
  });

  return NextResponse.json({
    success: true,
    message: "Retiro solicitado correctamente.",
    finalamount,
    feePercent, // utilidad para UI
  });
}

// GET - Obtener retiros del usuario
export async function GET(request: Request) {
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const userId = user.id;

  // 1. Obtener perfil para el flujo
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("flujo")
    .eq("id", userId)
    .single();

  const flowAmount = parseFloat(profile?.flujo || "0");

  // 2. Calcular inicio de la semana actual (Lunes)
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);

  // 3. Contar retiros semanales
  const { count: weeklyCount } = await supabase
    .from("withdrawals")
    .select("*", { count: 'exact', head: true })
    .eq("uid", userId)
    .gte("timestamp", monday.toISOString());

  const currentCount = weeklyCount || 0;
  let nextFeePercent = 10;

  if (currentCount === 1) {
    nextFeePercent = 15;
  } else if (currentCount >= 2) {
    nextFeePercent = 20;
  }

  if (flowAmount > 0) {
    nextFeePercent += 20;
  }

  // 4. Obtener retiros individuales
  const { data: withdrawals, error: fetchError } = await supabase
    .from("withdrawals")
    .select("*")
    .eq("uid", userId)
    .order("timestamp", { ascending: false });

  if (fetchError) {
    console.error("❌ Error al obtener retiros:", fetchError);
    return NextResponse.json({ error: "Error al obtener retiros" }, { status: 500 });
  }

  // Obtener total retirado (sumatoria de amount)
  const { data: totalData, error: totalError } = await supabase
    .from("withdrawals")
    .select("amount", { count: "exact", head: false })
    .eq("uid", userId);

  if (totalError) {
    console.error("❌ Error al calcular total retirado:", totalError);
    return NextResponse.json({ error: "Error al calcular total retirado" }, { status: 500 });
  }

  const totalRetirado = totalData?.reduce((acc, retiro) => acc + retiro.amount, 0) || 0;

  return NextResponse.json({
    withdrawals,
    totalRetirado: parseFloat(totalRetirado.toFixed(2)),
    currentWeekCount: currentCount,
    nextFeePercent: nextFeePercent,
  });
}
