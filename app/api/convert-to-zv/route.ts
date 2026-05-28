import { NextResponse } from "next/server";
import { createClient } from "../../utils/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const { zvAmount, usdtAmount, direction } = body;

  const usdt = parseFloat(usdtAmount);
  const zv = parseFloat(zvAmount);

  if (!usdt || usdt <= 0 || !zv || zv <= 0) {
    return NextResponse.json({ error: "Montos inválidos" }, { status: 400 });
  }

  // Obtener balances actuales
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("trc20balance, trc20conversion")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: "No se pudo obtener el perfil" }, { status: 500 });
  }

  const currentBalance = parseFloat(profile.trc20balance || "0");
  const currentConversion = parseFloat(profile.trc20conversion || "0");

  let newBalance, newConversion;

  if (direction === 'to_usdt') {
    // Conversión de ZV a USDT: restar de trc20conversion, sumar a trc20balance
    if (zv > currentConversion) {
      return NextResponse.json({ error: "Fondos insuficientes en ZV" }, { status: 400 });
    }
    newBalance = currentBalance + usdt;
    newConversion = currentConversion - zv;
  } else {
    // Conversión de USDT a ZV: restar de trc20balance, sumar a trc20conversion
    if (usdt > currentBalance) {
      return NextResponse.json({ error: "Fondos insuficientes en USDT" }, { status: 400 });
    }
    newBalance = currentBalance - usdt;
    newConversion = currentConversion + usdt;
  }

  // Actualizar balances
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ trc20balance: newBalance, trc20conversion: newConversion })
    .eq("id", user.id);

  if (updateError) {
    return NextResponse.json({ error: "Error al actualizar balances" }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    new_trc20balance: newBalance,
    new_trc20conversion: newConversion,
    converted: direction === 'to_usdt' ? usdt : zv,
  });
} 