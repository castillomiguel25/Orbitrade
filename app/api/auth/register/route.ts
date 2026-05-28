import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../utils/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, referredBy, phone, acceptedTerms } = await req.json();

    if (!email || !password || !name || !phone) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    if (!acceptedTerms) {
      return NextResponse.json(
        { error: 'Must accept terms and conditions' },
        { status: 400 }
      );
    }

    const supabase = await createClient(); // Asegúrate de usar await aquí

    // Paso 1: Registrar usuario
    const { data: user, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, phone, password, referredby: referredBy, accepted_terms_at: new Date().toISOString() },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (signUpError) {
      return NextResponse.json({ error: signUpError.message }, { status: 400 });
    }

    return NextResponse.json({ 
      message: 'Registro exitoso', 
      user: user.user,
      needsEmailVerification: true 
    });
  } catch (err) {
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}
