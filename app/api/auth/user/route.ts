import { NextResponse } from 'next/server';
import { createClient } from '../../../utils/supabase/server';

export async function GET() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    // Si no hay usuario o error, respondemos con 401
    return NextResponse.json({ user: null, error: error?.message || 'No autorizado' }, { status: 401 });
  }

  return NextResponse.json({ user }, { status: 200 });
}
