import { NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import { getSupabaseAdmin } from "@/app/utils/supabase/admin";

// Fecha de corte: 27/11/2025 00:00:00 UTC
const CUTOFF_ISO = "2025-11-27T00:00:00.000Z";

export async function GET() {
  // Obtener usuario actual (para descubrir su referralcode)
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // Usar admin para saltar RLS al consultar perfiles y depósitos de otros usuarios
  const supabaseAdmin = getSupabaseAdmin();

  // 1) Obtener referralcode del usuario
  const { data: myProfile, error: myProfileErr } = await supabaseAdmin
    .from("profiles")
    .select("id, referralcode")
    .eq("id", user.id)
    .single();

  if (myProfileErr || !myProfile) {
    return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
  }

  const referralCode = myProfile.referralcode;

  // 2) Referidos DIRECTOS (solo activos con hasinvested=true)
  const { data: directRefs, error: directErr } = await supabaseAdmin
    .from("profiles")
    .select("id, created_at, referralcode, name")
    .eq("referredby", referralCode)
    .eq("hasinvested", true);

  if (directErr) {
    return NextResponse.json({ error: directErr.message }, { status: 500 });
  }

  // Conteo de nuevos referidos de Nivel 1 (basado en depósitos desde la fecha de corte)
  let newReferralCountLevel1 = 0;

  // 3) Sumar montos de 'deposits' de DIRECTOS (sin importar cuándo se crearon),
  // solo planes ACTIVOS y desde la fecha de corte.
  // Activo: fecha_inicio >= cutoff y fecha_fin >= ahora
  const nowIso = new Date().toISOString();

  let newDepositsTotalAmount = 0;
  // Obtener TODOS los directos (sin filtro de fecha) para montos
  const { data: allDirectRefs, error: allDirectErr } = await supabaseAdmin
    .from("profiles")
    .select("id, referralcode")
    .eq("referredby", referralCode)
    .eq("hasinvested", true);

  if (allDirectErr) {
    return NextResponse.json({ error: allDirectErr.message }, { status: 500 });
  }

  const allDirectIds = (allDirectRefs || []).map((r: any) => r.id);

  if (allDirectIds.length > 0) {
    const { data: deposits, error: depErr } = await supabaseAdmin
      .from("deposits")
      .select("user_id, amount, fecha_inicio, fecha_fin")
      .in("user_id", allDirectIds)
      .gte("fecha_inicio", CUTOFF_ISO)
      .or(`fecha_fin.is.null,fecha_fin.gte.${nowIso}`);

    if (depErr) {
      return NextResponse.json({ error: depErr.message }, { status: 500 });
    }

    newDepositsTotalAmount = (deposits || []).reduce((acc: number, d: any) => {
      const amt = parseFloat(d.amount || "0");
      return acc + (isNaN(amt) ? 0 : amt);
    }, 0);

    const uniqueUserIdsL1 = new Set((deposits || []).map((d: any) => d.user_id));
    newReferralCountLevel1 = uniqueUserIdsL1.size;
  }

  // 4) Códigos de TODOS los directos (sin filtro de fecha) para padres de segundo nivel
  const allDirectCodes = (allDirectRefs || [])
    .map((r: any) => r.referralcode)
    .filter(Boolean);

  // 5) Segundo nivel (solo activos con hasinvested=true, conteo por depósitos desde la fecha de corte)
  let newReferralCountLevel2 = 0;

  // 6) Sumar montos de 'deposits' de segundo nivel (activos y desde la fecha de corte),
  // sin importar cuándo se crearon los referidos de segundo nivel.
  let newDepositsTotalAmountLevel2 = 0;
  // Obtener TODOS los de segundo nivel (sin filtro de fecha) para montos
  let secondAllIds: string[] = [];
  if (allDirectCodes.length > 0) {
    const { data: secondLevelAllRefs, error: secondAllErr } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .in("referredby", allDirectCodes)
      .eq("hasinvested", true);

    if (secondAllErr) {
      return NextResponse.json({ error: secondAllErr.message }, { status: 500 });
    }
    secondAllIds = (secondLevelAllRefs || []).map((r: any) => r.id);
  }

  if (secondAllIds.length > 0) {
    const { data: deposits2, error: depErr2 } = await supabaseAdmin
      .from("deposits")
      .select("user_id, amount, fecha_inicio, fecha_fin")
      .in("user_id", secondAllIds)
      .gte("fecha_inicio", CUTOFF_ISO)
      .or(`fecha_fin.is.null,fecha_fin.gte.${nowIso}`);

    if (depErr2) {
      return NextResponse.json({ error: depErr2.message }, { status: 500 });
    }

    newDepositsTotalAmountLevel2 = (deposits2 || []).reduce((acc: number, d: any) => {
      const amt = parseFloat(d.amount || "0");
      return acc + (isNaN(amt) ? 0 : amt);
    }, 0);

    const uniqueUserIdsL2 = new Set((deposits2 || []).map((d: any) => d.user_id));
    newReferralCountLevel2 = uniqueUserIdsL2.size;
  }

  return NextResponse.json({
    newReferralCountLevel1,
    newReferralCountLevel2,
    newDepositsTotalAmountLevel1: newDepositsTotalAmount,
    newDepositsTotalAmountLevel2,
    cutoff: CUTOFF_ISO,
  });
}
