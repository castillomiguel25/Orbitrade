// app/api/claim-earnings/route.ts
import { NextResponse } from "next/server";
import { createClient } from "../../utils/supabase/server";

export const runtime = "edge"; // o "nodejs" según tu config

export async function POST(request: Request) {
  const supabase = await createClient();
  const { user_id } = await request.json();

  if (!user_id) {
    return NextResponse.json({ error: "Falta user_id" }, { status: 400 });
  }

  const { data: deposits, error } = await supabase
    .from("deposits")
    .select("*")
    .eq("user_id", user_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const now = new Date();

  // 🕒 Convertir a hora local en formato YYYY-MM-DD HH:mm:ss
  const localDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
  let totalEarnings = 0;
  let earningsForFlowReduction = 0; // Ganancias que restan flujo (solo con-deposito)
  let activePlans = 0;

  // Reclamar y actualizar last_claimed
  const updates = deposits
    .filter((plan) => {
      const end = new Date(plan.fecha_fin);
      const last = new Date(plan.last_claimed || plan.fecha_inicio);
      const hours = (now.getTime() - last.getTime()) / 36e5;
      return now < end && hours >= 24;
    })
    .map((plan) => {
      const planName = String(plan.plan_nombre || '').toLowerCase().trim();
      const isNovaBoost = planName === 'nova boost';
      const amount = Number(plan.amount) || 0;
      const storedGanancia = Number(plan.ganancia_diaria) || 0;

      let ganancia = storedGanancia;
      if (isNovaBoost && amount > 0) {
        const start = new Date(plan.fecha_inicio);
        const startMs = start.getTime();
        if (!isNaN(startMs)) {
          const daysSinceStart = Math.max(
            0,
            Math.floor((now.getTime() - startMs) / (24 * 60 * 60 * 1000))
          );
          const rate = daysSinceStart < 10 ? 1.8 : 1.2;
          ganancia = amount * (rate / 100);
        }
      }
      totalEarnings += ganancia;
      
      // ANTES: Solo descontamos del flujo si el plan fue adquirido "con-deposito"
      // AHORA: Descontamos SIEMPRE del flujo, sin importar el origen de la inversión
      // if (plan.payment_source === 'con-deposito' || !plan.payment_source) {
        earningsForFlowReduction += ganancia;
      // }
      
      activePlans++;
      return supabase
        .from("deposits")
        .update({ last_claimed: localDate })
        .eq("id", plan.id);
    });

  await Promise.all(updates);

  // Si hay ganancias, actualizar balance
  if (totalEarnings > 0) {
    // Obtener el perfil del usuario
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("trc20balance, totalgenerated, flujo")
      .eq("id", user_id)
      .single();
  
    if (profileError || !profile) {
      return NextResponse.json({ error: "No se pudo obtener el perfil del usuario" }, { status: 500 });
    }
  
    // Calcular el nuevo balance (multiplicar ganancias por 1000)
    const nuevoBalance = parseFloat(profile.trc20balance) + totalEarnings 
    const nuevoTotal = parseFloat(profile.totalgenerated) + totalEarnings;
    // Solo restamos del flujo las ganancias de planes "con-deposito"
    const nuevoFlujo = parseFloat(profile.flujo || "0") - earningsForFlowReduction;


    // Actualizar el balance del usuario
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ trc20balance: nuevoBalance, totalgenerated: nuevoTotal, flujo: nuevoFlujo })
      .eq("id", user_id);
  
    if (updateError) {
      return NextResponse.json({ error: "Error al actualizar el balance del usuario" }, { status: 500 });
    }
  
    // Insertar registro en historial_ganancias
    const { error: insertError } = await supabase
      .from("historial_ganancias")
      .insert([
        {
          user_id: user_id,
          fecha: new Date().toISOString(),
          plan: "Recompensas acumuladas",
          ganancia: totalEarnings,
          reclamado: true,
        },
    ]);
  
    if (insertError) {
      return NextResponse.json({ error: "Error al insertar en historial de ganancias" }, { status: 500 });
    }

    // Registrar movimiento de saldo (ganancia)
    await supabase.from("balance_movements").insert({
      user_id: user_id,
      type: "earning",
      amount: totalEarnings,
      previous_balance: parseFloat(profile.trc20balance),
      new_balance: nuevoBalance,
      ref_id: null,
      note: "Ganancias reclamadas",
      metadata: { activePlans },
    });
  }  

  return NextResponse.json({
    message: "Ganancias reclamadas con éxito",
    total_earned: totalEarnings,
    active_plans: activePlans,
  });
}
