# Supabase Setup Guide

This project uses Supabase for the database and object storage. Please follow these steps to set it up.

## 1. Create a Project
Go to [supabase.com](https://supabase.com) and create a new project.

## 2. Database Schema
Run the following SQL in the SQL Editor to create the necessary tables:

```sql
-- Table for User/Template Sections
create table public.templates (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text, -- For the "text box for information"
  attachment_url text, -- For the uploaded file URL
  "order" integer default 0
);

-- Table for Users (Managed by Admin)
create table public.users (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  username text not null unique,
  name text not null,
  role text not null,
  "isAdmin" boolean default false,
  password text -- Note: In production, use Supabase Auth instead of storing passwords here
);

-- Enable Row Level Security (RLS)
alter table public.templates enable row level security;
alter table public.users enable row level security;

-- Create policies (Adjust as needed, currently public for demo)
create policy "Enable read access for all users" on public.templates 
for select using (true);
create policy "Enable insert for all users" on public.templates 
for insert with check (true);
create policy "Enable update for all users" on public.templates 
for update using (true);
create policy "Enable delete for all users" on public.templates 
for delete using (true);

create policy "Enable read access for all users" on public.users 
for select using (true);
create policy "Enable insert for all users" on public.users 
for insert with check (true);
create policy "Enable update for all users" on public.users 
for update using (true);
create policy "Enable delete for all users" on public.users 
for delete using (true);
```

## 3. Storage
1. Go to **Storage** in the sidebar.
2. Create a new public bucket named `template-attachments`.
3. Add a policy to allow uploads/reads (or make it public).

## 4. Environment Variables
Create a file named `.env` in the project root (`e:\ktproject\.env`) and add your Supabase credentials:

```bash
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

You can find these in Project Settings -> API.
