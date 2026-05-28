// app/api/extract-text/route.ts
import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js'

// Lazy-init to avoid build-time crashes when env vars are missing
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function POST(request: Request) {
  try {
    const { imageBase64 } = await request.json();

    if (!imageBase64) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    const { data, error } = await supabase.functions.invoke('openai-proxy', {
      body: { imageBase64 }
    });

    if (error) throw error;

    return NextResponse.json({ text: data.text });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error procesando la imagen" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Only POST allowed" }, { status: 405 });
}
