// /app/api/clave/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '../../utils/supabase/server';

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const body = await req.json();
  const { nuevaClave } = body;

  if (!nuevaClave) {
    return NextResponse.json({ error: 'Clave inválida' }, { status: 400 });
  }

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ withdrawalkey: nuevaClave })
    .eq('id', user.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Clave actualizada correctamente' });
}
