-- BackedSure core schema
-- Content tables (professions, products, questions, rules) are the source of
-- truth for a future admin panel; the application currently reads structured
-- content from src/data/*.ts and can be migrated to read from these tables
-- without changing the page templates.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Roles
-- ---------------------------------------------------------------------------
create table if not exists user_roles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('customer', 'admin')) default 'customer',
  created_at timestamptz not null default now()
);

create or replace function is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from user_roles where user_id = auth.uid() and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- Content / catalogue tables (public read, admin write)
-- ---------------------------------------------------------------------------
create table if not exists profession_categories (
  slug text primary key,
  name text not null,
  sort_order int not null default 0
);

create table if not exists professions (
  slug text primary key,
  name text not null,
  plural_name text not null,
  category_slug text not null references profession_categories (slug),
  rating_eligibility text not null check (rating_eligibility in ('rated', 'refer-only')),
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists profession_questions (
  id uuid primary key default gen_random_uuid(),
  profession_slug text not null references professions (slug) on delete cascade,
  question_id text not null,
  label text not null,
  type text not null check (type in ('text', 'number', 'currency', 'select', 'boolean', 'percentage')),
  options jsonb,
  help_text text,
  required boolean not null default false,
  sort_order int not null default 0,
  unique (profession_slug, question_id)
);

create table if not exists insurance_products (
  slug text primary key,
  name text not null,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists content_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  type text not null,
  title text not null,
  body jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists seo_metadata (
  id uuid primary key default gen_random_uuid(),
  path text not null unique,
  title text not null,
  description text not null,
  canonical text,
  og_image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Rating / underwriting
-- ---------------------------------------------------------------------------
-- Versioned rating rules. Never update calculatedPremium-bearing records in
-- place — a rule change creates a new row with a new rating_version, and
-- historical quote_requests keep referencing the version that produced them.
create table if not exists quote_rules (
  id uuid primary key default gen_random_uuid(),
  profession_slug text not null references professions (slug),
  rating_version text not null,
  rules jsonb not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (profession_slug, rating_version)
);

create table if not exists insurers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_info jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Customer-facing tables
-- ---------------------------------------------------------------------------
create table if not exists customers (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text,
  last_name text,
  email text not null,
  mobile text,
  company text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists quote_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  profession_slug text not null references professions (slug),
  answers jsonb not null,
  result jsonb not null,
  rating_version text not null,
  risk_classification text not null check (risk_classification in ('STANDARD', 'INDICATIVE', 'REFER')),
  contact_email text not null,
  created_at timestamptz not null default now()
);

create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  quote_request_id uuid references quote_requests (id),
  profession_slug text not null references professions (slug),
  status text not null default 'in_progress' check (status in ('in_progress', 'submitted', 'referred', 'accepted', 'declined')),
  cover_limit numeric,
  premium jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists quotes (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references applications (id) on delete cascade,
  insurer_id uuid references insurers (id),
  premium jsonb,
  cover_limit numeric,
  excess numeric,
  status text not null default 'draft' check (status in ('draft', 'issued', 'accepted', 'expired')),
  rating_version text not null,
  created_at timestamptz not null default now()
);

create table if not exists policies (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references applications (id),
  user_id uuid not null references auth.users (id) on delete cascade,
  policy_number text not null unique,
  insurer_id uuid references insurers (id),
  cover_limit numeric not null,
  excess numeric,
  premium jsonb,
  inception_date date not null,
  renewal_date date not null,
  status text not null default 'active' check (status in ('active', 'lapsed', 'cancelled', 'run_off')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  application_id uuid references applications (id),
  policy_id uuid references policies (id),
  storage_path text not null,
  file_name text not null,
  document_type text not null default 'other',
  created_at timestamptz not null default now()
);

create table if not exists claims (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  policy_number text not null,
  customer_name text not null,
  business text,
  email text not null,
  phone text,
  incident_date date,
  description text not null,
  status text not null default 'notified' check (status in ('notified', 'under_review', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table user_roles enable row level security;
alter table profession_categories enable row level security;
alter table professions enable row level security;
alter table profession_questions enable row level security;
alter table insurance_products enable row level security;
alter table content_pages enable row level security;
alter table seo_metadata enable row level security;
alter table quote_rules enable row level security;
alter table insurers enable row level security;
alter table customers enable row level security;
alter table quote_requests enable row level security;
alter table applications enable row level security;
alter table quotes enable row level security;
alter table policies enable row level security;
alter table documents enable row level security;
alter table claims enable row level security;

-- Public read access to catalogue/content tables.
create policy "Public read profession_categories" on profession_categories for select using (true);
create policy "Public read professions" on professions for select using (true);
create policy "Public read profession_questions" on profession_questions for select using (true);
create policy "Public read insurance_products" on insurance_products for select using (true);
create policy "Public read content_pages" on content_pages for select using (true);
create policy "Public read seo_metadata" on seo_metadata for select using (true);

-- Admin-only write access to catalogue/content tables.
create policy "Admin write profession_categories" on profession_categories for all using (is_admin()) with check (is_admin());
create policy "Admin write professions" on professions for all using (is_admin()) with check (is_admin());
create policy "Admin write profession_questions" on profession_questions for all using (is_admin()) with check (is_admin());
create policy "Admin write insurance_products" on insurance_products for all using (is_admin()) with check (is_admin());
create policy "Admin write content_pages" on content_pages for all using (is_admin()) with check (is_admin());
create policy "Admin write seo_metadata" on seo_metadata for all using (is_admin()) with check (is_admin());
create policy "Admin manage quote_rules" on quote_rules for all using (is_admin()) with check (is_admin());
create policy "Admin manage insurers" on insurers for all using (is_admin()) with check (is_admin());
create policy "Admin read user_roles" on user_roles for select using (is_admin());

-- Customers can only access their own records; admins can access all.
create policy "Customers manage own record" on customers for all
  using (auth.uid() = id or is_admin())
  with check (auth.uid() = id or is_admin());

create policy "Users read own quote_requests" on quote_requests for select
  using (auth.uid() = user_id or is_admin());
create policy "Users insert own quote_requests" on quote_requests for insert
  with check (auth.uid() = user_id or user_id is null);
create policy "Admin update quote_requests" on quote_requests for update
  using (is_admin()) with check (is_admin());

create policy "Users manage own applications" on applications for all
  using (auth.uid() = user_id or is_admin())
  with check (auth.uid() = user_id or is_admin());

create policy "Users read own quotes" on quotes for select
  using (exists (select 1 from applications a where a.id = quotes.application_id and (a.user_id = auth.uid() or is_admin())));
create policy "Admin manage quotes" on quotes for insert with check (is_admin());
create policy "Admin update quotes" on quotes for update using (is_admin()) with check (is_admin());

create policy "Users read own policies" on policies for select
  using (auth.uid() = user_id or is_admin());
create policy "Admin manage policies" on policies for insert with check (is_admin());
create policy "Admin update policies" on policies for update using (is_admin()) with check (is_admin());

create policy "Users manage own documents" on documents for all
  using (auth.uid() = user_id or is_admin())
  with check (auth.uid() = user_id or is_admin());

create policy "Users read own claims" on claims for select
  using (auth.uid() = user_id or is_admin());
create policy "Users insert own claims" on claims for insert
  with check (auth.uid() = user_id or user_id is null);
create policy "Admin update claims" on claims for update using (is_admin()) with check (is_admin());
