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

  const body = await request.json();

  // Validación opcional: asegurarse de que `body` no esté vacío
  if (!body || Object.keys(body).length === 0) {
    return NextResponse.json({ error: "No se proporcionaron datos para actualizar" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(body)
    .eq("id", user.id)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Perfil actualizado", profile: data });
}
