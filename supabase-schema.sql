-- Supabase Schema for Futquina
-- Copie e cole este código no SQL Editor do seu painel do Supabase e clique em "Run"

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ==========================================
-- 1. TABLES
-- ==========================================

-- Table: groups (Partidas)
create table if not exists public.groups (
    id text primary key,
    name text not null,
    created_at bigint not null
);

-- Forçamos a adição da coluna, mesmo se ela der algum erro anterior
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS user_id uuid references auth.users(id) on delete cascade;

-- Table: players (Jogadores)
create table if not exists public.players (
    id text primary key,
    name text not null,
    level smallint not null default 3,
    goalkeeper boolean not null default false,
    "hasPayed" boolean not null default false,
    group_id text references public.groups(id) on delete cascade
);

-- Table: teams (Times da Pelada/Sorteio)
create table if not exists public.teams (
    id text primary key,
    name text not null,
    "playerIds" jsonb not null default '[]'::jsonb,
    group_id text references public.groups(id) on delete cascade
);

-- Table: payments (Mensalidades/Pagamentos)
create table if not exists public.payments (
    id uuid default uuid_generate_v4() primary key,
    "playerId" text references public.players(id) on delete cascade,
    year integer not null,
    months jsonb not null default '{}'::jsonb,
    group_id text references public.groups(id) on delete cascade,
    -- Ensure only one record per player per year
    unique("playerId", year)
);

-- Table: match_history (Histórico de Partidas Concluídas)
create table if not exists public.match_history (
    id text primary key,
    date bigint not null,
    "teamAName" text not null,
    "teamBName" text not null,
    "scoreA" integer not null default 0,
    "scoreB" integer not null default 0,
    "events" jsonb not null default '[]'::jsonb,
    group_id text references public.groups(id) on delete cascade
);

-- Table: match_state (Partida Ativa)
create table if not exists public.match_state (
    id uuid default uuid_generate_v4() primary key,
    group_id text references public.groups(id) on delete cascade unique,
    "isActive" boolean not null default false,
    "isPaused" boolean not null default true,
    "timeRemaining" integer not null default 600,
    config jsonb not null default '{"duration": 10, "playersPerTeam": 5, "goalLimit": 5}'::jsonb,
    "scoreA" integer not null default 0,
    "scoreB" integer not null default 0,
    events jsonb not null default '[]'::jsonb,
    "lastUpdateTime" bigint
);


-- ==========================================
-- 2. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Habilitar RLS em todas as tabelas
alter table public.groups enable row level security;
alter table public.players enable row level security;
alter table public.teams enable row level security;
alter table public.payments enable row level security;
alter table public.match_history enable row level security;
alter table public.match_state enable row level security;


-- Policies for 'groups' (Partidas)
-- Usuário só pode ver, criar, editar e excluir as partidas onde o user_id for igual ao seu uuid
create policy "Users can view their own groups" 
    on public.groups for select 
    using (auth.uid() = user_id);

create policy "Users can insert their own groups" 
    on public.groups for insert 
    with check (auth.uid() = user_id);

create policy "Users can update their own groups" 
    on public.groups for update 
    using (auth.uid() = user_id);

create policy "Users can delete their own groups" 
    on public.groups for delete 
    using (auth.uid() = user_id);


-- Para tabelas filhas (Players, Teams, etc) que dependem do 'group_id'
-- Criamos funções para checar se o usuário é dono do Grupo vinculado àquele registro

create policy "Users can view players of their groups"
    on public.players for select
    using (exists (select 1 from public.groups where id = players.group_id and user_id = auth.uid()));

create policy "Users can insert players to their groups"
    on public.players for insert
    with check (exists (select 1 from public.groups where id = players.group_id and user_id = auth.uid()));

create policy "Users can update players of their groups"
    on public.players for update
    using (exists (select 1 from public.groups where id = players.group_id and user_id = auth.uid()));

create policy "Users can delete players of their groups"
    on public.players for delete
    using (exists (select 1 from public.groups where id = players.group_id and user_id = auth.uid()));


-- Policies for 'teams'
create policy "Users can view teams of their groups"
    on public.teams for select
    using (exists (select 1 from public.groups where id = teams.group_id and user_id = auth.uid()));

create policy "Users can insert teams to their groups"
    on public.teams for insert
    with check (exists (select 1 from public.groups where id = teams.group_id and user_id = auth.uid()));

create policy "Users can update teams of their groups"
    on public.teams for update
    using (exists (select 1 from public.groups where id = teams.group_id and user_id = auth.uid()));

create policy "Users can delete teams of their groups"
    on public.teams for delete
    using (exists (select 1 from public.groups where id = teams.group_id and user_id = auth.uid()));


-- Policies for 'payments'
create policy "Users can view payments of their groups"
    on public.payments for select
    using (exists (select 1 from public.groups where id = payments.group_id and user_id = auth.uid()));

create policy "Users can insert payments to their groups"
    on public.payments for insert
    with check (exists (select 1 from public.groups where id = payments.group_id and user_id = auth.uid()));

create policy "Users can update payments of their groups"
    on public.payments for update
    using (exists (select 1 from public.groups where id = payments.group_id and user_id = auth.uid()));

create policy "Users can delete payments of their groups"
    on public.payments for delete
    using (exists (select 1 from public.groups where id = payments.group_id and user_id = auth.uid()));


-- Policies for 'match_history'
create policy "Users can view match_history of their groups"
    on public.match_history for select
    using (exists (select 1 from public.groups where id = match_history.group_id and user_id = auth.uid()));

create policy "Users can insert match_history to their groups"
    on public.match_history for insert
    with check (exists (select 1 from public.groups where id = match_history.group_id and user_id = auth.uid()));

create policy "Users can update match_history of their groups"
    on public.match_history for update
    using (exists (select 1 from public.groups where id = match_history.group_id and user_id = auth.uid()));

create policy "Users can delete match_history of their groups"
    on public.match_history for delete
    using (exists (select 1 from public.groups where id = match_history.group_id and user_id = auth.uid()));


-- Policies for 'match_state'
create policy "Users can view match_state of their groups"
    on public.match_state for select
    using (exists (select 1 from public.groups where id = match_state.group_id and user_id = auth.uid()));

create policy "Users can insert match_state to their groups"
    on public.match_state for insert
    with check (exists (select 1 from public.groups where id = match_state.group_id and user_id = auth.uid()));

create policy "Users can update match_state of their groups"
    on public.match_state for update
    using (exists (select 1 from public.groups where id = match_state.group_id and user_id = auth.uid()));

create policy "Users can delete match_state of their groups"
    on public.match_state for delete
    using (exists (select 1 from public.groups where id = match_state.group_id and user_id = auth.uid()));
