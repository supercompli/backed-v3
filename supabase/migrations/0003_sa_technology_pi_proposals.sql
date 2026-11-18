-- SA Professional Indemnity — Technology proposal form submissions
-- (/sa-professional-indemnity-technology-quote). A separate, longer-form
-- proposal covering business details, directors & key people, staffing,
-- activities, clients, international exposure, continuity, claims and
-- financial history. Submissions go to a specialist for manual review,
-- tracked via `status` — this is not a rated quick-quote.

create table if not exists sa_technology_pi_proposals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  business_name text not null,
  contact_email text not null,
  contact_mobile text,
  answers jsonb not null,
  status text not null default 'submitted' check (status in ('submitted', 'under_review', 'quoted', 'declined')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table sa_technology_pi_proposals enable row level security;

create policy "Users read own sa_technology_pi_proposals" on sa_technology_pi_proposals for select
  using (auth.uid() = user_id or is_admin());
create policy "Users insert own sa_technology_pi_proposals" on sa_technology_pi_proposals for insert
  with check (auth.uid() = user_id or user_id is null);
create policy "Admin update sa_technology_pi_proposals" on sa_technology_pi_proposals for update
  using (is_admin()) with check (is_admin());
