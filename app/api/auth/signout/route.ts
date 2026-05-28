// app/api/auth/signout/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '../../../utils/supabase/server'; // Ajusta la ruta según la ubicación de tu archivo
import { cookies } from 'next/headers';

export async function POST() {
  const supabase = await createClient();
  
  // Cerrar sesión en Supabase
  await supabase.auth.signOut();

  // Eliminar cookies de sesión de forma segura
  const cookieStore = await cookies();
  const cookieNames = [
    'sb-access-token',
    'sb-refresh-token',
    'sb-provider-token',
  ];
  cookieNames.forEach((name) => {
    cookieStore.delete(name);
  });

  // Redirigir al usuario a la página de inicio
  return NextResponse.redirect('/');
}
