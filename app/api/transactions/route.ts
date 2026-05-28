import { NextResponse } from "next/server";
import { createClient } from "../../utils/supabase/server";
import { checkRateLimit, RATE_LIMITS } from "../../utils/rateLimit";

export async function POST(req: Request) {
  const supabase = await createClient();
  const body = await req.json();

  const {
    amount,
    user_id,
    email,
    balance,
    type = "deposit",
    name = "Depósito confirmado",
    transactionid,
    bonus = 0,
    amount_vip = 0,
    proof_url = "",
  } = body;

  if (!user_id || !email || !amount) {
    return NextResponse.json(
      { error: "Faltan campos obligatorios (user_id, email, amount)" },
      { status: 400 }
    );
  }

  if (!transactionid) {
    return NextResponse.json(
      { error: "Falta el transactionid" },
      { status: 400 }
    );
  }

  // Validar si transactionid ya existe para este usuario
  const { data: existingTx, error: checkError } = await supabase
    .from("transactions")
    .select("id")
    .eq("transactionid", transactionid)
    .eq("user_id", user_id)
    .maybeSingle();

  if (checkError) {
    console.error("Transaction check error:", checkError.message);
    return NextResponse.json({ error: "Transaction verification failed" }, { status: 500 });
  }

  if (existingTx) {
    return NextResponse.json(
      { error: "Esta transacción ya fue usada." },
      { status: 409 }
    );
  }

  const txName = name || `Depósito confirmado - ${transactionid}`;

  const { data, error } = await supabase.from("transactions").insert([
    {
      user_id,
      email,
      amount,
      balance,
      type,
      name: txName,
      transactionid,
      bonus,
      amount_vip,
      proof_url,
      date: new Date().toISOString(),
      is_read: false,
    },
  ]);

  if (error) {
    console.error("Transaction insert error:", error.message);
    return NextResponse.json({ error: "Failed to process transaction" }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limiting: max 10 req/min per user
  const rl = checkRateLimit(`transactions:${user.id}`, RATE_LIMITS.transactions);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.resetMs / 1000)) } }
    );
  }

  const { data, error } = await supabase
    .from("transactions")
    .select("id, date, name, amount, type, transactionid")
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Transaction fetch error:", error.message);
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }

  return NextResponse.json({ transactions: data || [] });
}
