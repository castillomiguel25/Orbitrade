import { NextResponse } from "next/server";
import { createClient } from "../../utils/supabase/server";
import { getPlan, validatePurchase } from "@/app/modules/plans";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const userId = user.id;
  const body = await request.json();

  // Accept planId (new) or fall back to plan.id (legacy clients)
  const planId: string = body.planId || body.plan?.id || "";
  const requestedAmount: unknown = body.amount ?? body.plan?.monto;

  if (!planId) {
    return NextResponse.json({ error: "Plan requerido" }, { status: 400 });
  }

  const plan = getPlan(planId);
  if (!plan) {
    return NextResponse.json({ error: "Plan no encontrado" }, { status: 400 });
  }

  const monto =
    typeof requestedAmount === "number" && !isNaN(requestedAmount)
      ? requestedAmount
      : plan.minPrice;
  const paymentSource =
    body.paymentSource === "con-deposito" || body.paymentSource === "sin-deposito"
      ? body.paymentSource
      : "con-deposito";

  const validation = validatePurchase(plan, monto);
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  // Obtain user profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("trc20balance, frozenbalance, dailyearnings")
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    return NextResponse.json(
      { error: "No se pudo obtener el perfil del usuario" },
      { status: 500 }
    );
  }

  const currentBalance = Number(profile.trc20balance) || 0;
  const currentFrozen = Number(profile.frozenbalance) || 0;
  const currentDaily = Number(profile.dailyearnings) || 0;

  const originalProfileState = {
    trc20balance: profile.trc20balance,
    frozenbalance: profile.frozenbalance,
    dailyearnings: profile.dailyearnings,
  };

  if (currentBalance < monto) {
    return NextResponse.json(
      { error: `Saldo insuficiente (se requieren ${monto} USDT)` },
      { status: 400 }
    );
  }

  const gananciaDiaria = monto * (plan.rendimiento / 100);
  const updates = {
    trc20balance: currentBalance - monto,
    frozenbalance: currentFrozen + monto,
    dailyearnings: currentDaily + gananciaDiaria,
  };

  // Optimistic-lock update: only succeeds if profile hasn't changed since we read it
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let q: any = supabase.from("profiles").update(updates).eq("id", userId);

  if (originalProfileState.trc20balance == null) {
    q = q.is("trc20balance", null);
  } else {
    q = q.eq("trc20balance", originalProfileState.trc20balance);
  }
  if (originalProfileState.frozenbalance == null) {
    q = q.is("frozenbalance", null);
  } else {
    q = q.eq("frozenbalance", originalProfileState.frozenbalance);
  }
  if (originalProfileState.dailyearnings == null) {
    q = q.is("dailyearnings", null);
  } else {
    q = q.eq("dailyearnings", originalProfileState.dailyearnings);
  }

  const { data: updatedRow, error: updateError } = await q.select("id").maybeSingle();

  if (updateError) {
    return NextResponse.json({ error: "Error al actualizar el perfil" }, { status: 500 });
  }
  if (!updatedRow) {
    return NextResponse.json(
      { error: "Ya hay una activación en proceso o esta compra ya fue procesada" },
      { status: 409 }
    );
  }

  // Build installation dates
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const fechaInicio = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  const fechaFin = new Date(now.getTime() + plan.duracionDias * 24 * 60 * 60 * 1000).toISOString();

  const { error: insertError } = await supabase.from("deposits").insert({
    id: crypto.randomUUID(),
    user_id: userId,
    amount: monto,
    rendimiento: plan.rendimiento,
    plan_nombre: plan.id,
    fecha_inicio: fechaInicio,
    fecha_fin: fechaFin,
    last_claimed: fechaInicio,
    ganancia_diaria: gananciaDiaria,
  });

  if (insertError) {
    console.error("Error inserting deposit installation:", {
      message: insertError.message,
      details: insertError.details,
      hint: insertError.hint,
      code: insertError.code,
      userId,
      planId: plan.id,
      amount: monto,
      paymentSource,
    });

    // Revert profile update on insert failure
    await supabase
      .from("profiles")
      .update({
        trc20balance: originalProfileState.trc20balance,
        frozenbalance: originalProfileState.frozenbalance,
        dailyearnings: originalProfileState.dailyearnings,
      })
      .eq("id", userId)
      .eq("trc20balance", updates.trc20balance)
      .eq("frozenbalance", updates.frozenbalance)
      .eq("dailyearnings", updates.dailyearnings);

    return NextResponse.json({ error: "Error al guardar la instalación" }, { status: 500 });
  }

  await supabase.from("balance_movements").insert({
    user_id: userId,
    type: "invest",
    amount: -monto,
    previous_balance: currentBalance,
    new_balance: currentBalance - monto,
    ref_id: plan.id,
    note: `Instalación de ${plan.id} (${plan.rendimiento}% diario)`,
    metadata: { planId: plan.id, rendimiento: plan.rendimiento, gananciaDiaria },
  });

  return NextResponse.json({ message: "¡Instalación activada exitosamente!" });
}
