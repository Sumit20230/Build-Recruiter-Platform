create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  role text check (role in ('recruiter', 'jobseeker')) not null,
  full_name text,
  avatar_url text,
  headline text,
  bio text,
  company text,
  location text,
  linkedin_url text,
  created_at timestamptz default now()
);

create table if not exists public.work_experience (
  id uuid primary key default gen_random_uuid(),
  recruiter_id uuid references public.profiles(id) on delete cascade,
  company text not null,
  title text not null,
  start_date date,
  end_date date,
  description text
);

create table if not exists public.job_postings (
  id uuid primary key default gen_random_uuid(),
  recruiter_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  company text not null,
  location text,
  job_type text,
  description text,
  skills text[],
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.follows (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid references public.profiles(id) on delete cascade,
  following_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique(follower_id, following_id)
);

create table if not exists public.profile_views (
  id uuid primary key default gen_random_uuid(),
  recruiter_id uuid references public.profiles(id) on delete cascade,
  viewer_id uuid references public.profiles(id) on delete set null,
  viewed_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.work_experience enable row level security;
alter table public.job_postings enable row level security;
alter table public.follows enable row level security;
alter table public.profile_views enable row level security;

drop policy if exists "profiles are readable by authenticated users" on public.profiles;
create policy "profiles are readable by authenticated users"
on public.profiles for select to authenticated using (true);

drop policy if exists "users create their own profile" on public.profiles;
create policy "users create their own profile"
on public.profiles for insert to authenticated with check (auth.uid() = id);

drop policy if exists "users update their own profile" on public.profiles;
create policy "users update their own profile"
on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "work is publicly readable to authenticated users" on public.work_experience;
create policy "work is publicly readable to authenticated users"
on public.work_experience for select to authenticated using (true);

drop policy if exists "recruiters manage their work" on public.work_experience;
create policy "recruiters manage their work"
on public.work_experience for all to authenticated
using (auth.uid() = recruiter_id)
with check (auth.uid() = recruiter_id and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'recruiter'));

drop policy if exists "jobs are publicly readable to authenticated users" on public.job_postings;
create policy "jobs are publicly readable to authenticated users"
on public.job_postings for select to authenticated using (true);

drop policy if exists "recruiters manage their jobs" on public.job_postings;
create policy "recruiters manage their jobs"
on public.job_postings for all to authenticated
using (auth.uid() = recruiter_id)
with check (auth.uid() = recruiter_id and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'recruiter'));

drop policy if exists "follows are readable" on public.follows;
create policy "follows are readable"
on public.follows for select to authenticated using (true);

drop policy if exists "jobseekers follow recruiters" on public.follows;
create policy "jobseekers follow recruiters"
on public.follows for insert to authenticated
with check (
  auth.uid() = follower_id
  and exists (select 1 from public.profiles p where p.id = follower_id and p.role = 'jobseeker')
  and exists (select 1 from public.profiles p where p.id = following_id and p.role = 'recruiter')
);

drop policy if exists "jobseekers remove their follows" on public.follows;
create policy "jobseekers remove their follows"
on public.follows for delete to authenticated using (auth.uid() = follower_id);

drop policy if exists "views are readable by authenticated users" on public.profile_views;
create policy "views are readable by authenticated users"
on public.profile_views for select to authenticated using (true);

drop policy if exists "authenticated users can record profile views" on public.profile_views;
create policy "authenticated users can record profile views"
on public.profile_views for insert to authenticated with check (auth.uid() = viewer_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'jobseeker'),
    new.raw_user_meta_data->>'full_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();


create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.job_postings(id) on delete cascade,
  applicant_id uuid references public.profiles(id) on delete cascade,
  status text check (status in ('pending', 'reviewed', 'shortlisted', 'rejected')) default 'pending',
  message text,
  created_at timestamptz default now(),
  unique(job_id, applicant_id)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  message text not null,
  type text,
  is_read boolean default false,
  created_at timestamptz default now()
);

alter table public.job_applications enable row level security;
alter table public.notifications enable row level security;

drop policy if exists "recruiters see applications for their jobs" on public.job_applications;
create policy "recruiters see applications for their jobs"
on public.job_applications for select to authenticated
using (
  exists (
    select 1 from public.job_postings j 
    where j.id = job_id and j.recruiter_id = auth.uid()
  )
  or applicant_id = auth.uid()
);

drop policy if exists "jobseekers can apply" on public.job_applications;
create policy "jobseekers can apply"
on public.job_applications for insert to authenticated
with check (
  auth.uid() = applicant_id 
  and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'jobseeker')
);

drop policy if exists "recruiters can update application status" on public.job_applications;
create policy "recruiters can update application status"
on public.job_applications for update to authenticated
using (
  exists (
    select 1 from public.job_postings j 
    where j.id = job_id and j.recruiter_id = auth.uid()
  )
);

drop policy if exists "users can see their own notifications" on public.notifications;
create policy "users can see their own notifications"
on public.notifications for select to authenticated
using (auth.uid() = user_id);

drop policy if exists "users can update their own notifications" on public.notifications;
create policy "users can update their own notifications"
on public.notifications for update to authenticated
using (auth.uid() = user_id);

drop policy if exists "system can create notifications" on public.notifications;
create policy "system can create notifications"
on public.notifications for insert to authenticated

-- Enable Realtime for all core tables
do $$
begin
  alter publication supabase_realtime add table public.profiles;
exception when others then null; end $$;

do $$
begin
  alter publication supabase_realtime add table public.work_experience;
exception when others then null; end $$;

do $$
begin
  alter publication supabase_realtime add table public.job_postings;
exception when others then null; end $$;

do $$
begin
  alter publication supabase_realtime add table public.follows;
exception when others then null; end $$;

do $$
begin
  alter publication supabase_realtime add table public.profile_views;
exception when others then null; end $$;

do $$
begin
  alter publication supabase_realtime add table public.job_applications;
exception when others then null; end $$;

do $$
begin
  alter publication supabase_realtime add table public.notifications;
exception when others then null; end $$;
