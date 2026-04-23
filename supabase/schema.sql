-- ─────────────────────────────────────────────────────────────
-- BuildBoss Schema
-- Run this once in: Supabase Dashboard → SQL Editor → New query
-- ─────────────────────────────────────────────────────────────

-- PROJECTS
create table public.projects (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users not null,
  name        text not null,
  address     text,
  phase       text default 'Planning',
  budget      numeric(12,2) default 0,
  start_date  date,
  end_date    date,
  status      text default 'active',
  notes       text,
  description text,
  created_at  timestamptz default now()
);
alter table public.projects enable row level security;
create policy "users own their projects" on public.projects
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- SUBCONTRACTORS
create table public.subs (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users not null,
  name       text not null,
  trade      text,
  phone      text,
  email      text,
  licensed   boolean default false,
  insured    boolean default false,
  rating     int check (rating between 1 and 5),
  status     text default 'active',
  notes      text,
  created_at timestamptz default now()
);
alter table public.subs enable row level security;
create policy "users own their subs" on public.subs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- PERMITS
create table public.permits (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users not null,
  project_id uuid references public.projects on delete cascade not null,
  type       text,
  number     text,
  issued     date,
  expires    date,
  status     text default 'active',
  created_at timestamptz default now()
);
alter table public.permits enable row level security;
create policy "users own their permits" on public.permits
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- INSPECTIONS
create table public.inspections (
  id           uuid primary key default gen_random_uuid(),
  permit_id    uuid references public.permits on delete cascade not null,
  name         text not null,
  scheduled_date date,
  status       text default 'pending',
  created_at   timestamptz default now()
);
alter table public.inspections enable row level security;
create policy "users own their inspections" on public.inspections
  for all using (
    exists (
      select 1 from public.permits p
      where p.id = permit_id and p.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.permits p
      where p.id = permit_id and p.user_id = auth.uid()
    )
  );

-- TASKS / SCHEDULE
create table public.tasks (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users not null,
  project_id uuid references public.projects on delete cascade not null,
  sub_id     uuid references public.subs on delete set null,
  title      text not null,
  phase      text,
  due_date   date,
  status     text default 'upcoming',
  created_at timestamptz default now()
);
alter table public.tasks enable row level security;
create policy "users own their tasks" on public.tasks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- BUDGET LINE ITEMS
create table public.budget_items (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users not null,
  project_id uuid references public.projects on delete cascade not null,
  category   text not null,
  budgeted   numeric(12,2) default 0,
  actual     numeric(12,2) default 0,
  paid       boolean default false,
  created_at timestamptz default now()
);
alter table public.budget_items enable row level security;
create policy "users own their budget items" on public.budget_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- SAFETY CHECKLIST
create table public.safety_items (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users not null,
  text       text not null,
  done       boolean default false,
  created_at timestamptz default now()
);
alter table public.safety_items enable row level security;
create policy "users own their safety items" on public.safety_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
