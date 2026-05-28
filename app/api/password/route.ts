// app/api/changePassword/route.ts
import { NextResponse } from "next/server";
import { createClient } from "../../utils/supabase/server";  // tu SSR client
import { getSupabaseAdmin } from "../../utils/supabase/admin";

export async function POST(request: Request) {
  // 1️⃣ Obtenemos el SSR client y la sesión
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // 2️⃣ Leemos el payload
  const { currentPassword, newPassword } = await request.json();
  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  const userId = user.id;
  const email = user.email!;

  // 3️⃣ Verificamos la contraseña actual usando el mismo SSR client (anon key)
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password: currentPassword,
  });
  if (signInError) {
    return NextResponse.json({ error: "Contraseña actual incorrecta" }, { status: 401 });
  }

  // 4️⃣ Cambiamos la contraseña usando el cliente admin (service_role)
  const { error: adminError } = await getSupabaseAdmin().auth.admin.updateUserById(userId, {
    password: newPassword,
  });
  if (adminError) {
    console.error("admin.updateUserById error:", adminError);
    return NextResponse.json({ error: "Error al cambiar la contraseña" }, { status: 500 });
  }

  return NextResponse.json({ message: "Contraseña actualizada correctamente" });
}
