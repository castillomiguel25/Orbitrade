import { NextResponse } from "next/server";
import { createClient } from "../../utils/supabase/server";

export const runtime = "edge";

const PRIZES = [
  { amount: 0.10, probability: 35 },
  { amount: 0.15, probability: 40 },
  { amount: 0.35, probability: 10 },
  { amount: 0.50, probability: 10 },
  { amount: 0.70, probability: 4 },
  { amount: 1.00, probability: 1 }
];

export async function POST(request: Request) {
  const supabase = await createClient();
  const { user_id, prize_amount } = await request.json();

  if (!user_id || prize_amount === undefined) {
    return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 });
  }

  // Verificar que el premio enviado coincida con uno de los premios válidos
  const validPrize = PRIZES.find(p => p.amount === prize_amount);
  if (!validPrize) {
    return NextResponse.json({ error: "Premio inválido" }, { status: 400 });
  }

  // Obtener el perfil del usuario para verificar tickets
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("tickets, trc20balance")
    .eq("id", user_id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: "No se pudo obtener el perfil del usuario" }, { status: 500 });
  }

  // Verificar si tiene tickets disponibles
  if (profile.tickets <= 0) {
    return NextResponse.json({ error: "No tienes tickets disponibles" }, { status: 400 });
  }

  // Descontar un ticket
  const newTickets = profile.tickets - 1;

  // Calcular nuevo balance usando el premio validado
  const newBalance = parseFloat(profile.trc20balance) + validPrize.amount;

  // Actualizar tickets y balance del usuario
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ 
      tickets: newTickets,
      trc20balance: newBalance 
    })
    .eq("id", user_id);

  if (updateError) {
    return NextResponse.json({ error: "Error al actualizar el perfil" }, { status: 500 });
  }

  // Registrar el giro en el historial con el premio validado
  const { error: historyError } = await supabase
    .from("historial_ganancias")
    .insert([
      {
        user_id: user_id,
        fecha: new Date().toISOString(),
        plan: "Premio Ruleta",
        ganancia: validPrize.amount,
        reclamado: true,
      },
    ]);

  if (historyError) {
    return NextResponse.json({ error: "Error al registrar el historial" }, { status: 500 });
  }

  return NextResponse.json({
    message: "¡Felicitaciones!",
    prize: validPrize.amount,
    remaining_tickets: newTickets,
    new_balance: newBalance
  });
} 