-- PROFILES (extensão da tabela auth.users do Supabase)
create table profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  name        text not null,
  email       text not null,
  phone       text,
  role        text not null default 'runner'
              check (role in ('runner', 'guide', 'both')),
  avatar_url  text,
  language    text not null default 'pt',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- GUIDES (perfil público de cada guia)
create table guides (
  id               uuid references profiles(id) on delete cascade primary key,
  city             text not null,
  country          text not null default 'BR',
  bio              text,
  modality         text[] not null default '{}',
  run_types        text[] not null default '{}',
  services         text[] not null default '{}',
  experience_years text,
  strava_url       text,
  instagram_url    text,
  is_paid          boolean not null default false,
  price_brl        numeric(10,2),
  schedule         text,
  languages        text[] not null default '{pt}',
  is_active        boolean not null default true,
  rating_avg       numeric(3,2) not null default 0,
  rating_count     integer not null default 0,
  total_runs       integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- BOOKINGS (pedidos de corrida)
create table bookings (
  id            uuid primary key default gen_random_uuid(),
  runner_id     uuid not null references profiles(id),
  guide_id      uuid not null references guides(id),
  city          text not null,
  run_date      date not null,
  run_time      time not null,
  modality      text not null check (modality in ('presential', 'virtual')),
  distance_km   numeric(5,2),
  pace          text,
  language      text not null default 'pt',
  notes         text,
  status        text not null default 'pending'
                check (status in ('pending','accepted','refused','completed','cancelled')),
  reminder_sent boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- REVIEWS (avaliações pós-corrida)
create table reviews (
  id           uuid primary key default gen_random_uuid(),
  booking_id   uuid not null references bookings(id),
  reviewer_id  uuid not null references profiles(id),
  reviewed_id  uuid not null references profiles(id),
  rating       integer not null check (rating between 1 and 5),
  comment      text,
  created_at   timestamptz not null default now(),
  unique(booking_id, reviewer_id)
);

-- GROUPS (diretório de grupos — sem fluxo transacional)
create table groups (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  city           text not null,
  state          text,
  country        text not null default 'BR',
  is_free        boolean not null default true,
  meeting_place  text,
  meeting_time   time,
  meeting_days   text[] not null default '{}',
  how_to_join    text,
  contact        text,
  instagram_url  text,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now()
);

-- RLS (Row Level Security)
alter table profiles enable row level security;
alter table guides enable row level security;
alter table bookings enable row level security;
alter table reviews enable row level security;
alter table groups enable row level security;

-- Policies
create policy "Profiles públicos visíveis" on profiles
  for select using (true);

create policy "Usuário edita próprio perfil" on profiles
  for update using (auth.uid() = id);

create policy "Usuário insere próprio perfil" on profiles
  for insert with check (auth.uid() = id);

create policy "Guias públicos visíveis" on guides
  for select using (is_active = true);

create policy "Guia edita próprio perfil" on guides
  for update using (auth.uid() = id);

create policy "Guia insere próprio perfil" on guides
  for insert with check (auth.uid() = id);

create policy "Corredor ou guia vê seus pedidos" on bookings
  for select using (auth.uid() = runner_id or auth.uid() = guide_id);

create policy "Corredor cria pedido" on bookings
  for insert with check (auth.uid() = runner_id);

create policy "Guia ou corredor atualiza pedido" on bookings
  for update using (auth.uid() = runner_id or auth.uid() = guide_id);

create policy "Reviews públicas" on reviews
  for select using (true);

create policy "Usuário cria review" on reviews
  for insert with check (auth.uid() = reviewer_id);

create policy "Groups visíveis" on groups
  for select using (is_active = true);

-- Trigger para atualizar updated_at automaticamente
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at before update on profiles
  for each row execute function update_updated_at();

create trigger guides_updated_at before update on guides
  for each row execute function update_updated_at();

create trigger bookings_updated_at before update on bookings
  for each row execute function update_updated_at();
