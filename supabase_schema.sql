-- Ejecutar esto una vez en Supabase: Panel izquierdo > SQL Editor > New query > pegar y "Run"

create table if not exists kv_store (
  key text primary key,
  value text,
  updated_at timestamptz default now()
);

alter table kv_store enable row level security;

-- Política simple para uso personal: cualquiera con la anon key (solo vos, si no compartís
-- la URL ni la key) puede leer y escribir. No hay login de por medio.
create policy "permitir todo con anon key"
  on kv_store
  for all
  using (true)
  with check (true);
