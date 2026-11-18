-- Customer dashboard access.
-- Quotes, proposals and claims are usually submitted before the customer has
-- an account, so they're stored with user_id = null. Customers sign in with an
-- emailed link, which proves they own the address, so they can also read
-- records submitted under that email.

create or replace function current_user_email()
returns text
language sql
stable
as $$
  select lower(nullif(auth.jwt() ->> 'email', ''));
$$;

create policy "Users read quote_requests by email" on quote_requests for select
  using (lower(contact_email) = current_user_email());

create policy "Users read technology_pi_proposals by email" on technology_pi_proposals for select
  using (lower(contact_email) = current_user_email());

create policy "Users read sa_technology_pi_proposals by email" on sa_technology_pi_proposals for select
  using (lower(contact_email) = current_user_email());

create policy "Users read claims by email" on claims for select
  using (lower(email) = current_user_email());

-- Profile: a single display name alongside the legacy first/last columns.
alter table customers add column if not exists full_name text;

-- Private bucket for policy documents, one folder per user: <user_id>/<file>.
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

create policy "Users read own document files" on storage.objects for select
  using (
    bucket_id = 'documents'
    and ((storage.foldername(name))[1] = auth.uid()::text or is_admin())
  );

create policy "Admin manage document files" on storage.objects for all
  using (bucket_id = 'documents' and is_admin())
  with check (bucket_id = 'documents' and is_admin());
