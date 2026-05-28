import { NextResponse } from "next/server";
import { createClient } from "../../utils/supabase/server";

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
  const { tickets, points } = body;

  if (!tickets || tickets < 1 || !points || points < 10) {
    return NextResponse.json({ error: "Cantidad inválida" }, { status: 400 });
  }

  // Verify points are correct (10 points = 1 ticket)
  if (points !== tickets * 10) {
    return NextResponse.json({ error: "Error en el cálculo de puntos" }, { status: 400 });
  }

  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("points, tickets")
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: "No se pudo obtener el perfil del usuario" }, { status: 500 });
  }

  // Check if user has enough points
  if (!profile.points || profile.points < points) {
    return NextResponse.json({ error: "No tienes suficientes puntos" }, { status: 400 });
  }

  // Update profile
  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      points: profile.points - points,
      tickets: (profile.tickets || 0) + tickets,
    })
    .eq("id", userId);

  if (updateError) {
    return NextResponse.json({ error: "Error al actualizar el perfil" }, { status: 500 });
  }

  return NextResponse.json({
    message: "Tickets canjeados exitosamente",
    ticketsAdded: tickets,
    pointsUsed: points,
  });
} 