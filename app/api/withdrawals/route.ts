// imports and configuration
import { NextResponse } from "next/server";
import { createClient } from "../../utils/supabase/server";
import { v4 as uuidv4 } from "uuid";
import { WITHDRAWAL_MIN_AMOUNT } from "@/app/constants/withdrawal";
import { checkRateLimit, RATE_LIMITS } from "../../utils/rateLimit";
import { computeFeePercent, verifyWithdrawalKey } from "@/app/modules/withdrawals";

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

  // Obtener el balance actual del usuario y clave de retiro
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("trc20balance, withdrawalkey")
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
  if (numericAmount > currentBalance) {
    return NextResponse.json({ error: "Fondos insuficientes" }, { status: 400 });
  }

  const day = now.getDay(); // 0 (Dom) a 6 (Sab)
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);

  const { count: weeklyCount, error: countError } = await supabase
    .from("withdrawals")
    .select("*", { count: 'exact', head: true })
    .eq("uid", userId)
    .gte("timestamp", monday.toISOString());

  if (countError) {
    console.error("Error contando retiros semanales:", countError);
    return NextResponse.json({ error: "Error al calcular la comisión de retiro" }, { status: 500 });
  }

  const feePercent = computeFeePercent(weeklyCount || 0, false);

  const fee = parseFloat((numericAmount * (feePercent / 100)).toFixed(2));
  const finalamount = parseFloat((numericAmount - fee).toFixed(2));

  // Normalizar la red de retiro a BEP20
  const requestedNetwork = typeof network === 'string' ? network.toUpperCase() : 'BEP20';
  const bankDetails = requestedNetwork === 'BEP20' ? 'BEP20' : 'BEP20';

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

  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);

  const { count: weeklyCount, error: countError } = await supabase
    .from("withdrawals")
    .select("*", { count: 'exact', head: true })
    .eq("uid", userId)
    .gte("timestamp", monday.toISOString());

  if (countError) {
    console.error("❌ Error contando retiros semanales:", countError);
    return NextResponse.json({ error: "Error al calcular la comisión de retiro" }, { status: 500 });
  }

  const currentCount = weeklyCount || 0;
  const nextFeePercent = computeFeePercent(currentCount, false);

  // Obtener retiros individuales
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
