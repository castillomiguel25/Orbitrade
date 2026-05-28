import { NextResponse } from "next/server";
import { createClient } from "../../utils/supabase/server";

// GET - Obtener perfil del usuario
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profiles: data });
}

// POST - Actualizar perfil del usuario
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

  const { trc20balance, ...otrosCampos } = body;

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      ...(trc20balance !== undefined && { trc20balance }),
      ...otrosCampos,
    })
    .eq("id", userId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: "Perfil actualizado correctamente" });
}
