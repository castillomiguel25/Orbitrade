import { NextResponse } from "next/server";
import { createClient } from "../../utils/supabase/server";

function normalize(value: any): string {
  return String(value || "").toLowerCase().trim();
}

function dayKeyUtc(value: string | Date): string | null {
  const d = typeof value === "string" ? new Date(value) : value;
  if (isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

const SPECIAL_DEPOSIT_ONLY_PLANS: Record<
  string,
  { title: string; rate: number; min: number; max: number; durationDays: number }
> = {
  "plan-17": {
    title: "Plan 1.7%",
    rate: 1.7,
    min: 50,
    max: 400,
    durationDays: 365,
  },
  "plan-20": {
    title: "Plan 2.5%",
    rate: 2.5,
    min: 100,
    max: 400,
    durationDays: 365,
  },
  "plan-23": {
    title: "Plan 2.3%",
    rate: 2.3,
    min: 120,
    max: 400,
    durationDays: 365,
  },
};


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
  const { plan, amount: requestedAmount, paymentSource } = body;

  if (!plan) {
    return NextResponse.json({ error: "Datos del plan faltantes" }, { status: 400 });
  }

  // Validar duración
  if (typeof plan.duracionDias !== 'number' || isNaN(plan.duracionDias)) {
    return NextResponse.json({ error: "Duración del plan inválida" }, { status: 400 });
  }

  const localNow = new Date();

  const fecha_inicio = `${localNow.getFullYear()}-${String(localNow.getMonth() + 1).padStart(2, "0")}-${String(localNow.getDate()).padStart(2, "0")} ${String(localNow.getHours()).padStart(2, "0")}:${String(localNow.getMinutes()).padStart(2, "0")}:${String(localNow.getSeconds()).padStart(2, "0")}`;

  const endDate = new Date(localNow.getTime() + plan.duracionDias * 24 * 60 * 60 * 1000);

  // Obtener perfil del usuario
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("trc20balance, frozenbalance, dailyearnings, hasinvested, first_deposit_amount, rango")
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: "No se pudo obtener el perfil del usuario" }, { status: 500 });
  }

  // Coerción segura de campos numéricos del perfil (evitar NaN/null)
  const currentBalance = Number(profile.trc20balance) || 0;
  const currentFrozen = Number(profile.frozenbalance) || 0;
  const currentDaily = Number(profile.dailyearnings) || 0;
  const originalProfileState = {
    trc20balance: profile.trc20balance,
    frozenbalance: profile.frozenbalance,
    dailyearnings: profile.dailyearnings,
  };
  const planId = normalize(plan.id);

  function applyOriginalProfileFilters(query: any) {
    let nextQuery = query.eq("id", userId);

    if (originalProfileState.trc20balance == null) {
      nextQuery = nextQuery.is("trc20balance", null);
    } else {
      nextQuery = nextQuery.eq("trc20balance", originalProfileState.trc20balance);
    }

    if (originalProfileState.frozenbalance == null) {
      nextQuery = nextQuery.is("frozenbalance", null);
    } else {
      nextQuery = nextQuery.eq("frozenbalance", originalProfileState.frozenbalance);
    }

    if (originalProfileState.dailyearnings == null) {
      nextQuery = nextQuery.is("dailyearnings", null);
    } else {
      nextQuery = nextQuery.eq("dailyearnings", originalProfileState.dailyearnings);
    }

    return nextQuery;
  }

  async function applyProfileUpdateOnce(updates: {
    trc20balance: number;
    frozenbalance: number;
    dailyearnings: number;
  }) {
    const { data, error } = await applyOriginalProfileFilters(
      supabase
      .from("profiles")
      .update(updates)
      .select("id")
    ).maybeSingle();

    if (error) {
      return { error, conflict: false };
    }

    if (!data) {
      return { error: null, conflict: true };
    }

    return { error: null, conflict: false };
  }

  async function revertProfileUpdate(updates: {
    trc20balance: number;
    frozenbalance: number;
    dailyearnings: number;
  }) {
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
  }

  // Determinar monto a invertir: permitir monto variable >= plan.monto
  // Coerción segura de campos del plan
  const planMin = Number(plan.minPrice) || Number(plan.monto) || 0;
  const planMax = Number(plan.maxPrice);
  const planRate = Number(plan.rendimiento) || 0;
  const rankMap: Record<string, number> = {
    'zyx-drone': 1,
    'vortex-hunter': 2,
    'nebula-sentinel': 3,
    'plasma-wraith': 4,
    'crimson-overlord': 5,
  };
  const requiredRank = rankMap[String(plan.id || '').toLowerCase()] || 1;
  const userRank = Number((profile as any).rango) || 1;
  if (userRank < requiredRank) {
    return NextResponse.json({ error: `Este plan requiere rango ${requiredRank}` }, { status: 403 });
  }

  const monto = (typeof requestedAmount === 'number' && !isNaN(requestedAmount))
    ? Number(requestedAmount)
    : planMin;

  // Límite de inversión total para Rango 1
  if (userRank === 1) {
    const totalInvestedAfterPurchase = currentFrozen + monto;
    if (totalInvestedAfterPurchase > 800) {
      return NextResponse.json({ 
        error: "rank1_limit_exceeded" 
      }, { status: 400 });
    }
  }

  if (monto < planMin) {
    return NextResponse.json({ error: `El monto mínimo es ${planMin} USDT` }, { status: 400 });
  }

  if (planMax && monto > planMax) {
    return NextResponse.json({ error: `El monto máximo es ${planMax} USDT` }, { status: 400 });
  }

  const specialPlan = SPECIAL_DEPOSIT_ONLY_PLANS[planId];
  if (specialPlan) {
    const PLAN_DURATION_DAYS = specialPlan.durationDays;
    const PLAN_RATE = specialPlan.rate;
    const PLAN_MIN = specialPlan.min;
    const PLAN_MAX = specialPlan.max;
    const PLAN_TITLE = specialPlan.title;

    if (monto < PLAN_MIN) {
      return NextResponse.json({ error: `El monto mínimo es ${PLAN_MIN} USDT` }, { status: 400 });
    }

    if (monto > PLAN_MAX) {
      return NextResponse.json({ error: `El monto máximo es ${PLAN_MAX} USDT` }, { status: 400 });
    }

    if (paymentSource !== "con-deposito") {
      return NextResponse.json({ error: "Este plan solo puede activarse mediante depósito" }, { status: 403 });
    }

    const { data: existingDeposits, error: existingDepositsError } = await supabase
      .from("deposits")
      .select("id, plan_nombre")
      .eq("user_id", userId)
      .limit(500);

    if (existingDepositsError) {
      return NextResponse.json({ error: "Error validando compras previas" }, { status: 500 });
    }

    const alreadyPurchased = (existingDeposits || []).some((d: any) => normalize(d.plan_nombre) === normalize(PLAN_TITLE));
    if (alreadyPurchased) {
      return NextResponse.json({ error: "Este plan es compra única por usuario" }, { status: 409 });
    }

    const today = dayKeyUtc(new Date());
    const { data: recentDeposits, error: recentDepositsError } = await supabase
      .from("transactions")
      .select("date")
      .eq("user_id", userId)
      .eq("type", "deposit")
      .order("date", { ascending: false })
      .limit(50);

    if (recentDepositsError) {
      return NextResponse.json({ error: "Error validando depósito del día" }, { status: 500 });
    }

    const hasDepositToday = (recentDeposits || []).some((tx: any) => {
      const k = dayKeyUtc(tx.date);
      return !!today && !!k && k === today;
    });

    if (!hasDepositToday) {
      return NextResponse.json({ error: "Debes tener un depósito confirmado hoy para activar este plan" }, { status: 403 });
    }

    if (currentBalance < monto) {
      return NextResponse.json({
        error: `Saldo insuficiente en SALDO TRC20 (Se requiere ${monto} USDT)`
      }, { status: 400 });
    }

    const localNow = new Date();
    const fechaInicio = `${localNow.getFullYear()}-${String(localNow.getMonth() + 1).padStart(2, "0")}-${String(localNow.getDate()).padStart(2, "0")} ${String(localNow.getHours()).padStart(2, "0")}:${String(localNow.getMinutes()).padStart(2, "0")}:${String(localNow.getSeconds()).padStart(2, "0")}`;
    const endDateFixed = new Date(localNow.getTime() + PLAN_DURATION_DAYS * 24 * 60 * 60 * 1000);
    const gananciaDiariaFixed = monto * (PLAN_RATE / 100);

    const updates: {
      trc20balance: number;
      frozenbalance: number;
      dailyearnings: number;
    } = {
      trc20balance: currentBalance - monto,
      frozenbalance: currentFrozen + monto,
      dailyearnings: currentDaily + gananciaDiariaFixed,
    };

    const guardedUpdate = await applyProfileUpdateOnce(updates);
    if (guardedUpdate.error) {
      return NextResponse.json({ error: "Error al actualizar el perfil" }, { status: 500 });
    }

    if (guardedUpdate.conflict) {
      return NextResponse.json({
        error: "Ya hay una activación en proceso o esta compra ya fue procesada"
      }, { status: 409 });
    }

    const { error: insertError } = await supabase.from("deposits").insert({
      user_id: userId,
      amount: monto,
      rendimiento: PLAN_RATE,
      plan_nombre: PLAN_TITLE,
      fecha_inicio: fechaInicio,
      fecha_fin: endDateFixed.toISOString(),
      last_claimed: fechaInicio,
      ganancia_diaria: gananciaDiariaFixed,
      payment_source: "con-deposito",
    });

    if (insertError) {
      await revertProfileUpdate(updates);
      return NextResponse.json({ error: "Error al guardar inversión" }, { status: 500 });
    }

    await supabase.from("balance_movements").insert({
      user_id: userId,
      type: "invest",
      amount: -monto,
      previous_balance: currentBalance,
      new_balance: currentBalance - monto,
      ref_id: PLAN_TITLE,
      note: `Activación de ${PLAN_TITLE} con depósito del día`,
      metadata: { rendimiento: PLAN_RATE, gananciaDiaria: gananciaDiariaFixed, payment_source: "con-deposito" },
    });

    return NextResponse.json({ message: "¡Plan activado exitosamente!" });
  }

  // Compra única por usuario para ciertos planes
  const singlePurchaseIds = new Set(['dragon', 'galaxian', 'plan-28']);

  const planIdNormalized = String(plan.id || '').toLowerCase();
  if (singlePurchaseIds.has(planIdNormalized)) {
    const { data: existingDeposits, error: depositsError } = await supabase
      .from("deposits")
      .select("id, plan_nombre")
      .eq("user_id", userId);

    if (depositsError) {
      return NextResponse.json({ error: "Error validando compras previas" }, { status: 500 });
    }

    const normalize = (s: any) => String(s || '').toLowerCase().trim();
    const alreadyPurchased = (existingDeposits || []).some((d: any) => {
      const name = normalize(d.plan_nombre);
      if (planIdNormalized === 'galaxian') return name === 'galaxian';
      if (planIdNormalized === 'dragon') return name === 'dragon' || name === 'plan dragón';
      if (planIdNormalized === 'plan-28') return name === 'plan 2.8%';
      return false;
    });

    if (alreadyPurchased) {
      return NextResponse.json({ error: "Este plan es compra única por usuario" }, { status: 409 });
    }
  }

  // Verificar saldo suficiente (Siempre descontamos de trc20balance según instrucción)
  if (currentBalance < monto) {
    return NextResponse.json({ 
      error: `Saldo insuficiente en SALDO TRC20 (Se requiere ${monto} USDT)` 
    }, { status: 400 });
  }

  const gananciaDiaria = monto * (planRate / 100);

  // Insertar en la tabla de depósitos
  const updates: {
    trc20balance: number;
    frozenbalance: number;
    dailyearnings: number;
  } = {
    trc20balance: currentBalance - monto,
    frozenbalance: currentFrozen + monto,
    dailyearnings: currentDaily + gananciaDiaria,
  };

  const guardedUpdate = await applyProfileUpdateOnce(updates);
  if (guardedUpdate.error) {
    return NextResponse.json({ error: "Error al actualizar el perfil" }, { status: 500 });
  }

  if (guardedUpdate.conflict) {
    return NextResponse.json({
      error: "Ya hay una activación en proceso o esta compra ya fue procesada"
    }, { status: 409 });
  }

  const { error: insertError } = await supabase.from("deposits").insert({
    user_id: userId,
    amount: monto,
    rendimiento: planRate,
    plan_nombre: plan.title || plan.titleKey || "",
    fecha_inicio,
    fecha_fin: endDate.toISOString(),
    last_claimed: fecha_inicio,
    ganancia_diaria: gananciaDiaria,
    payment_source: paymentSource || 'trc20balance',
  });

  if (insertError) {
    await revertProfileUpdate(updates);
    return NextResponse.json({ error: "Error al guardar inversión" }, { status: 500 });
  }

  // Si es la primera inversión

  // if (!hasinvested) {
  //   updates.hasinvested = true;
  //   updates.first_deposit_amount = plan.monto;

  //   const { data: userProfile, error: userProfileError } = await supabase
  //     .from("profiles")
  //     .select("referredby")
  //     .eq("id", userId)
  //     .single();

  //   if (userProfileError) console.error('Error fetching userProfile:', userProfileError);

  //   if (userProfile?.referredby) {
  //     // Primer nivel: incluir frozenbalance y validar > 0
  //     const { data: firstLevelUser, error: firstLevelError } = await supabase
  //       .from("profiles")
  //       .select("id, referralcode, referredby, frozenbalance")
  //       .eq("referralcode", userProfile.referredby)
  //       .single();

  //     if (firstLevelError) console.error('Error fetching firstLevelUser:', firstLevelError);

  //     if (firstLevelUser) {
  //       if (firstLevelUser.frozenbalance > 0) {
  //         const firstLevelId = firstLevelUser.id;
  //         const firstLevelRewardDecout = plan.monto - 10;
  //         const firstLevelReward = firstLevelRewardDecout * 0.07;

  //         const { error: insertReferralError } = await supabaseAdmin.from("referrals").insert({
  //           referred_id: userId,
  //           referrer_id: firstLevelId,
  //           level: 1,
  //           reward_amount: firstLevelReward,
  //           date: new Date().toISOString(),
  //           status: 'pending',
  //         });

  //         if (insertReferralError) {
  //           console.error("Error insertando referral primer nivel:", insertReferralError);
  //           return NextResponse.json({ error: "Error insertando referral primer nivel" }, { status: 500 });
  //         }
  //       }

  //       // Segundo nivel: incluir frozenbalance y validar > 0
  //       if (firstLevelUser.referredby) {
  //         const { data: secondLevelUser } = await supabase
  //           .from("profiles")
  //           .select("id, referredby, frozenbalance")
  //           .eq("referralcode", firstLevelUser.referredby)
  //           .single();

  //         if (secondLevelUser) {
  //           if (secondLevelUser.frozenbalance > 0) {
  //             const secondLevelId = secondLevelUser.id;
  //             const secondLevelRewardDecout = plan.monto - 10;
  //             const secondLevelReward = secondLevelRewardDecout * 0.05;

  //             await supabaseAdmin.from("referrals").insert({
  //               referred_id: userId,
  //               referrer_id: secondLevelId,
  //               level: 2,
  //               reward_amount: secondLevelReward,
  //               date: new Date().toISOString(),
  //               status: 'pending',
  //             });
  //           }

  //           // Tercer nivel: incluir frozenbalance y validar > 0
  //           if (secondLevelUser.referredby) {
  //             const { data: thirdLevelUser } = await supabase
  //               .from("profiles")
  //               .select("id, frozenbalance")
  //               .eq("referralcode", secondLevelUser.referredby)
  //               .single();

  //             if (thirdLevelUser && thirdLevelUser.frozenbalance > 0) {
  //               const thirdLevelRewardDecout = plan.monto - 10;
  //               const thirdLevelReward = thirdLevelRewardDecout * 0.01;

  //               await supabaseAdmin.from("referrals").insert({
  //                 referred_id: userId,
  //                 referrer_id: thirdLevelUser.id,
  //                 level: 3,
  //                 reward_amount: thirdLevelReward,
  //                 date: new Date().toISOString(),
  //                 status: 'pending',
  //               });
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // }

  // Registrar movimiento de saldo (inversión)
  await supabase.from("balance_movements").insert({
    user_id: userId,
    type: "invest",
    amount: -monto,
    previous_balance: currentBalance,
    new_balance: currentBalance - monto,
    ref_id: plan.title || plan.titleKey || "",
    note: `Inversión en plan ${plan.title || plan.titleKey} usando ${paymentSource || 'saldo principal'}`,
    metadata: { rendimiento: planRate, gananciaDiaria, payment_source: paymentSource || 'trc20balance' },
  });

  return NextResponse.json({ message: "¡Inversión realizada exitosamente!" });
}
