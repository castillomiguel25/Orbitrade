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
  const { tickets } = body;

  if (!tickets || tickets < 1) {
    return NextResponse.json({ error: "Cantidad de tickets inválida" }, { status: 400 });
  }

  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("tickets")
    .eq("id", userId)
    .single();

  if (profileError) {
    return NextResponse.json({ error: "No se pudo obtener el perfil del usuario" }, { status: 500 });
  }

  // Update profile with new tickets
  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      tickets: (profile?.tickets || 0) + tickets,
    })
    .eq("id", userId);

  if (updateError) {
    return NextResponse.json({ error: "Error al actualizar los tickets" }, { status: 500 });
  }

  return NextResponse.json({
    message: "Tickets actualizados exitosamente",
    ticketsAdded: tickets,
  });
} 