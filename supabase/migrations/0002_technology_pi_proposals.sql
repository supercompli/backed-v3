-- Technology / IT Professional Indemnity proposal form submissions.
-- Mirrors the iTOO Special Risks "Technology/Telecommunications" proposal
-- form (/professional-indemnity-technology-quote). This is a full
-- underwriting proposal, not a rated quick-quote, so it has no
-- risk_classification/premium fields — submissions go to a specialist for
-- manual review, tracked via `status`.

create table if not exists technology_pi_proposals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  insured_name text not null,
  contact_email text not null,
  contact_mobile text,
  answers jsonb not null,
  status text not null default 'submitted' check (status in ('submitted', 'under_review', 'quoted', 'declined')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table technology_pi_proposals enable row level security;

create policy "Users read own technology_pi_proposals" on technology_pi_proposals for select
  using (auth.uid() = user_id or is_admin());
create policy "Users insert own technology_pi_proposals" on technology_pi_proposals for insert
  with check (auth.uid() = user_id or user_id is null);
create policy "Admin update technology_pi_proposals" on technology_pi_proposals for update
  using (is_admin()) with check (is_admin());
