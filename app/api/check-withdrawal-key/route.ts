import { NextResponse } from "next/server";
import { createClient } from "../../utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    // Obtener el perfil del usuario
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("withdrawalkey")
      .eq("id", user.id)
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: "Error al obtener el perfil" },
        { status: 500 }
      );
    }

    // Verificar si tiene clave de retiro configurada
    return NextResponse.json({
      hasKey: Boolean(profile?.withdrawalkey),
    });

  } catch (err) {
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
} 