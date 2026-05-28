import { NextResponse } from "next/server";
import { createClient } from "../../utils/supabase/server";

export async function GET() {
  const supabase = await createClient();

  // Obtener usuario autenticado
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // Obtener referralCode del usuario
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, referralcode")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
  }

  // Contar referidos directos
  const { count, error: countError } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("referredby", profile.referralcode);

  if (countError) {
    return NextResponse.json({ error: countError.message }, { status: 500 });
  }

  const zrvs_balance = (count || 0) * 10;

  // Actualizar el balance en el perfil
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ zrvs_balance })
    .eq("id", user.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ zrvs_balance, referidos: count || 0 });
} 