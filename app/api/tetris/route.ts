import { NextResponse } from "next/server";
import { createClient } from "../../utils/supabase/server";

export const runtime = "nodejs";

const REWARD_PER_LEVEL = 0.10;

export async function GET() {
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // Fetch user's referral code
  const { data: profile, error: profileError } = await supabase
    .from("profiles").select("referralcode").eq("id", user.id).single();
  if (profileError || !profile) {
    return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
  }

  // Contar referidos que hayan invertido (sin restricción por fecha)
  const { data: referred, error: referredErr } = await supabase
    .from("profiles")
    .select("id, created_at, first_deposit_amount")
    .eq("referredby", profile.referralcode)
    .gt("first_deposit_amount", 0);

  if (referredErr) {
    return NextResponse.json({ error: referredErr.message }, { status: 500 });
  }

  const investedReferralsCount = (referred || []).length;
  const canPlayAfterLevel10 = investedReferralsCount > 0;

  // Fetch already awarded levels for the user
  const { data: rewards, error: rewardsErr } = await supabase
    .from("tetris_rewards")
    .select("level")
    .eq("user_id", user.id);
  if (rewardsErr) {
    return NextResponse.json({ error: rewardsErr.message }, { status: 500 });
  }

  const awardedLevels = (rewards || []).map(r => r.level);
  return NextResponse.json({
    awardedLevels,
    canPlayAfterLevel10,
    investedReferralsCount,
  });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const level = Number(body?.level);
  const score = Number(body?.score);
  if (!Number.isFinite(level) || level < 1) {
    return NextResponse.json({ error: "Nivel inválido" }, { status: 400 });
  }

  // Avoid double-award per level
  const { data: existing, error: existErr } = await supabase
    .from("tetris_rewards")
    .select("id")
    .eq("user_id", user.id)
    .eq("level", level)
    .maybeSingle();
  if (existErr) {
    return NextResponse.json({ error: existErr.message }, { status: 500 });
  }
  if (existing) {
    return NextResponse.json({ awarded: false, message: "Nivel ya premiado" });
  }

  // Insert reward record first
  const { data: rewardRow, error: insertErr } = await supabase
    .from("tetris_rewards")
    .insert({
      user_id: user.id,
      level,
      reward_amount: REWARD_PER_LEVEL,
      score_at_claim: Number.isFinite(score) ? score : null,
      claimed_at: new Date().toISOString(),
    })
    .select("id")
    .single();
  if (insertErr) {
    return NextResponse.json({ error: insertErr.message }, { status: 500 });
  }

  // Credit user balance
  const { data: profile, error: profErr } = await supabase
    .from("profiles").select("trc20balance").eq("id", user.id).single();
  if (profErr || !profile) {
    return NextResponse.json({ error: "Perfil no encontrado" }, { status: 500 });
  }
  const previous = parseFloat(profile.trc20balance || "0");
  const amount = REWARD_PER_LEVEL;
  const next = previous + amount;

  const { error: updErr } = await supabase
    .from("profiles")
    .update({ trc20balance: next })
    .eq("id", user.id);
  if (updErr) {
    return NextResponse.json({ error: "Error al acreditar balance" }, { status: 500 });
  }

  // Log movement
  await supabase.from("balance_movements").insert({
    user_id: user.id,
    type: "earning",
    amount,
    previous_balance: previous,
    new_balance: next,
    ref_id: rewardRow.id,
    note: `Recompensa Tetris nivel ${level}`,
    metadata: { game: "tetris", level, score },
  });

  return NextResponse.json({ awarded: true, new_balance: next, amount });
}
