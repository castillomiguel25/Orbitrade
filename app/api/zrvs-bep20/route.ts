import { NextResponse } from "next/server";
import { createClient } from "../../utils/supabase/server";

// Guardar o consultar dirección BEP-20
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { bep20_address } = await request.json();

  if (!bep20_address || typeof bep20_address !== "string" || bep20_address.length < 10) {
    return NextResponse.json({ error: "Dirección inválida" }, { status: 400 });
  }

  // Verificar si ya existe
  const { data: profile } = await supabase
    .from("profiles")
    .select("bep20_address")
    .eq("id", user.id)
    .single();

  if (profile?.bep20_address) {
    return NextResponse.json({ message: "Dirección ya configurada", bep20_address: profile.bep20_address });
  }

  // Guardar dirección
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ bep20_address })
    .eq("id", user.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Dirección guardada correctamente", bep20_address });
}

// Consultar dirección BEP-20
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("bep20_address")
    .eq("id", user.id)
    .single();

  if (!profile?.bep20_address) {
    return NextResponse.json({ bep20_address: null });
  }

  return NextResponse.json({ bep20_address: profile.bep20_address });
} 