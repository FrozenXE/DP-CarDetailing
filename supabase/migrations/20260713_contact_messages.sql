-- Run this in the Supabase SQL Editor if the contact_messages table does not
-- already have these fields and an anonymous insert policy.

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'contact_messages'
      and policyname = 'Anyone can submit contact messages'
  ) then
    create policy "Anyone can submit contact messages"
      on public.contact_messages
      for insert
      to anon, authenticated
      with check (true);
  end if;
end;
$$;
