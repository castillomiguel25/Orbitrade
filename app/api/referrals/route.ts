import { NextResponse } from "next/server";
import { createClient } from "../../utils/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  
  if (userError || !user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const userid = user.id;

  // 🔹 1. Obtener tu referralCode desde profiles usando el email
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("referralcode")
    .eq("id", userid)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
  }

  const referralCode = profile.referralcode;

  // 🔹 2. Obtener referidos de primer nivel
  const { data: primerNivel, error: primerError } = await supabase
    .from("profiles")
    .select("id, name, created_at, first_deposit_amount, frozenbalance, referralcode")
    .eq("referredby", referralCode);

  if (primerError) {
    return NextResponse.json({ error: primerError.message }, { status: 500 });
  }

  // 🔹 3. Obtener IDs de primer nivel para buscar los de segundo nivel
  const primerNivelIds = primerNivel.map((ref) => ref.referralcode);

  // 🔹 4. Obtener referidos de segundo nivel
  const { data: segundoNivel, error: segundoError } = await supabase
    .from("profiles")
    .select("id, name, created_at, first_deposit_amount, frozenbalance, referredby, referralcode")
    .in("referredby", primerNivelIds);

  if (segundoError) {
    return NextResponse.json({ error: segundoError.message }, { status: 500 });
  }

  const primerNivelWithEmail = (primerNivel || []).map((ref: any) => ({ ...ref, email: null }));
  const segundoNivelWithEmail = (segundoNivel || []).map((ref: any) => ({ ...ref, email: null }));

  // Leer descuentos de fondeo desde variable de entorno (JSON: [{ email, funding }])
  const fundingConfigRaw = process.env.REFERRAL_FUNDING_DEDUCTIONS;
  const fundingMap = new Map<string, number>();
  if (fundingConfigRaw) {
    try {
      const arr = JSON.parse(fundingConfigRaw);
      if (Array.isArray(arr)) {
        for (const item of arr) {
          const email = (item?.email || '').toLowerCase();
          const funding = parseFloat(item?.funding ?? '0');
          if (email && !isNaN(funding) && funding > 0) fundingMap.set(email, funding);
        }
      }
    } catch {}
  }

  const formatRef = (ref: any, nivel: number) => {
    const frozenRaw = parseFloat(ref.frozenbalance || "0");
    const emailKey = (ref.email || '').toLowerCase();
    const fundingDeduct = fundingMap.get(emailKey) || 0;
    const adjusted = Math.max(0, frozenRaw - (isNaN(fundingDeduct) ? 0 : fundingDeduct));

    return {
      id: ref.id,
      email: ref.email ?? null,
      nombre: ref.name,
      fecha: new Date(ref.created_at).toLocaleDateString("es-ES"),
      nivel,
      depositoActivo: parseFloat(ref.first_deposit_amount) > 0,
      totalGanado: parseFloat(ref.first_deposit_amount).toFixed(2),
      frozenbalance: frozenRaw.toFixed(2),
      frozenbalanceAdjusted: adjusted.toFixed(2),
    };
  };
  

  const todosReferidos = [
    ...primerNivelWithEmail.map((ref) => formatRef(ref, 1)),
    ...segundoNivelWithEmail.map((ref) => formatRef(ref, 2)),
  ];

  return NextResponse.json({ referrals: todosReferidos });
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { referral_id } = await request.json();
  if (!referral_id) {
    return NextResponse.json({ error: "Falta referral_id" }, { status: 400 });
  }

  // Buscar recompensa pendiente
  const { data: referral, error: refErr } = await supabase
    .from("referrals")
    .select("id, referrer_id, referred_id, level, reward_amount, status")
    .eq("id", referral_id)
    .single();

  if (refErr || !referral) {
    return NextResponse.json({ error: "Recompensa no encontrada" }, { status: 404 });
  }

  if (referral.status !== "pending") {
    return NextResponse.json({ error: "La recompensa no está pendiente" }, { status: 400 });
  }

  // Solo permitir pagar al dueño (referrer) de la recompensa
  if (referral.referrer_id !== user.id) {
    return NextResponse.json({ error: "No autorizado para acreditar esta recompensa" }, { status: 403 });
  }

  // Obtener balance actual del referrer
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("trc20balance, flujo")
    .eq("id", referral.referrer_id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: "Perfil no encontrado" }, { status: 500 });
  }

  const previous = parseFloat(profile.trc20balance || "0");
  const amount = parseFloat(referral.reward_amount || "0");
  const next = previous + amount;
  
  // También sumamos al flujo el monto de la recompensa
  const previousFlow = parseFloat(profile.flujo || "0");
  const nextFlow = previousFlow + amount;

  // Acreditar balance, flujo y marcar referral como pagado
  const { error: updErr } = await supabase
    .from("profiles")
    .update({ 
      trc20balance: next,
      flujo: nextFlow
    })
    .eq("id", referral.referrer_id);

  if (updErr) {
    return NextResponse.json({ error: "Error al acreditar balance" }, { status: 500 });
  }

  const { error: statusErr } = await supabase
    .from("referrals")
    .update({ status: "paid" })
    .eq("id", referral.id);

  if (statusErr) {
    return NextResponse.json({ error: "Error al actualizar estado de recompensa" }, { status: 500 });
  }

  // Registrar movimiento de saldo (earning por referido)
  await supabase.from("balance_movements").insert({
    user_id: referral.referrer_id,
    type: "earning",
    amount,
    previous_balance: previous,
    new_balance: next,
    ref_id: referral.id,
    note: `Recompensa por referido (Nivel ${referral.level})`,
    metadata: { referred_id: referral.referred_id, level: referral.level },
  });

  return NextResponse.json({ success: true, new_balance: next, amount });
}
