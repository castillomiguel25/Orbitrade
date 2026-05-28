// app/api/upload-proof/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '../../utils/supabase/server';

export async function POST(req: Request) {
    const supabase = await createClient();

  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { imageBase64 } = await req.json();

  if (!imageBase64) {
    return NextResponse.json({ error: 'Falta la imagen' }, { status: 400 });
  }

  try {
    const response = await fetch(
      'https://ssryhvrzseozlbtvabqa.supabase.co/functions/v1/openai-proxy',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ imageBase64 }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error || 'Error en función de Supabase' }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error interno:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
