-- Applied to knowledge-hub Supabase project (academy_progress_google_auth).
create table if not exists public.academy_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id integer not null check (lesson_id between 1 and 100),
  best_score integer not null default 0 check (best_score between 0 and 100),
  completed_at timestamptz not null default now(),
  primary key(user_id,lesson_id)
);
alter table public.academy_progress enable row level security;
revoke all on public.academy_progress from anon;
grant select,insert,update on public.academy_progress to authenticated;
create policy "Academy users read own progress" on public.academy_progress for select to authenticated using ((select auth.uid())=user_id);
create policy "Academy users insert own progress" on public.academy_progress for insert to authenticated with check ((select auth.uid())=user_id);
create policy "Academy users update own progress" on public.academy_progress for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
