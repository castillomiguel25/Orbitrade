// utils/supabase/admin.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Lazy-initialized Supabase admin client (service_role).
 * Avoids build-time crashes when runtime-only env vars are not available.
 */
let _supabaseAdmin: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    }

    _supabaseAdmin = createClient(url, key);
  }
  return _supabaseAdmin;
}
