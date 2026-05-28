import { NextResponse } from "next/server";
import { createClient } from "../../utils/supabase/server";

export const runtime = "edge";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { user_id } = await request.json();

  if (!user_id) {
    return NextResponse.json({ error: "Falta user_id" }, { status: 400 });
  }

  const { data: deposits, error } = await supabase
    .from("deposits")
    .select("id, last_claimed")
    .eq("user_id", user_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!deposits || deposits.length === 0) {
    return NextResponse.json({ last_claimed: null, plan_id: null });
  }

  const now = new Date();

  const processedDeposits = deposits
    .filter((d) => d.last_claimed !== null && d.last_claimed !== undefined)
    .map((d) => {
      const lastClaimedDate = new Date(d.last_claimed); // ya está en UTC
      const hoursPassed = (now.getTime() - lastClaimedDate.getTime()) / (1000 * 60 * 60);
      const hoursRemaining = 24 - hoursPassed;
      return {
        id: d.id,
        last_claimed: lastClaimedDate,
        hoursPassed,
        hoursRemaining,
      };
    });

  const eligibleDeposits = processedDeposits.filter((d) => d.hoursPassed >= 24);

  eligibleDeposits.sort((a, b) => a.last_claimed.getTime() - b.last_claimed.getTime());

  if (eligibleDeposits.length === 0) {
    // No hay depósitos elegibles, calcular el más cercano
    const closest = processedDeposits.reduce((min, current) =>
      current.hoursRemaining < min.hoursRemaining ? current : min
    );


    const hours = Math.floor(closest.hoursRemaining);
    const minutes = Math.round((closest.hoursRemaining - hours) * 60);

    return NextResponse.json({
      last_claimed: null,
      plan_id: null,
      time_remaining_hours: closest.hoursRemaining.toFixed(2),
      time_remaining_human: `${hours} horas y ${minutes} minutos`,
      closest_plan_id: closest.id,
    });
  }

  const nextPlan = eligibleDeposits[0];

  return NextResponse.json({
    last_claimed: nextPlan.last_claimed.toISOString(),
    plan_id: nextPlan.id,
  });
}
