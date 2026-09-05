-- Ejecutar esto una vez en Supabase: panel izquierdo > "SQL Editor" > "New query" > pegar todo > "Run"

create table if not exists kv_store (
  key text primary key,
  value text,
  updated_at timestamptz default now()
);

alter table kv_store enable row level security;

-- Con esta política, SOLO alguien que inició sesión (con el usuario y contraseña
-- que vas a crear en "Authentication") puede leer o escribir datos. Sin login, no se
-- puede hacer nada, aunque alguien tenga la URL de la app.
create policy "solo usuarios logueados"
  on kv_store
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
