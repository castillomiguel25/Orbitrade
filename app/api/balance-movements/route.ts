import { NextResponse } from "next/server";
import { createClient } from "../../utils/supabase/server";

export const runtime = "nodejs";

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("balance_movements")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ movements: data || [] });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { type, amount, previous_balance, new_balance, ref_id, note, metadata } = body;

  if (!type || typeof amount !== "number" || typeof previous_balance !== "number" || typeof new_balance !== "number") {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  const { error } = await supabase.from("balance_movements").insert({
    user_id: user.id,
    type,
    amount,
    previous_balance,
    new_balance,
    ref_id,
    note,
    metadata,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}