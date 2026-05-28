import { NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';

export async function GET(request: Request) {
  const supabase = await createClient();
  
  // Verificar usuario autenticado
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ max_level: 1, max_score: 0 }, { status: 200 });
  }

  // Obtener stats
  const { data, error } = await supabase
    .from('galaxian_stats')
    .select('max_level, max_score')
    .eq('user_id', user.id)
    .single();

  if (error || !data) {
    // Si no existe, devolver valores por defecto
    return NextResponse.json({ max_level: 1, max_score: 0 }, { status: 200 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  
  // Verificar usuario autenticado
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { level, score } = body;

  if (typeof level !== 'number' || typeof score !== 'number') {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }

  // Obtener datos actuales para ver si mejoramos el récord
  const { data: currentStats } = await supabase
    .from('galaxian_stats')
    .select('max_level, max_score')
    .eq('user_id', user.id)
    .single();

  const currentMaxLevel = currentStats?.max_level || 1;
  const currentMaxScore = currentStats?.max_score || 0;

  const newMaxLevel = Math.max(currentMaxLevel, level);
  const newMaxScore = Math.max(currentMaxScore, score);

  // Upsert (Insertar o Actualizar)
  const { error } = await supabase
    .from('galaxian_stats')
    .upsert({
      user_id: user.id,
      max_level: newMaxLevel,
      max_score: newMaxScore,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ max_level: newMaxLevel, max_score: newMaxScore });
}
