-- Crea la tabla para guardar el progreso de Galaxian
-- Ejecuta este código en el SQL Editor de tu Supabase Dashboard

create table if not exists public.galaxian_stats (
  user_id uuid references public.profiles(id) not null primary key,
  max_level int default 1,
  max_score int default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Habilitar RLS (Row Level Security)
alter table public.galaxian_stats enable row level security;

-- Política para que el usuario pueda ver su propio score
create policy "Users can view their own galaxian stats"
on public.galaxian_stats for select
using ( auth.uid() = user_id );

-- Política para que el usuario pueda insertar/actualizar su score
create policy "Users can insert/update their own galaxian stats"
on public.galaxian_stats for insert
with check ( auth.uid() = user_id );

create policy "Users can update their own galaxian stats"
on public.galaxian_stats for update
using ( auth.uid() = user_id );
