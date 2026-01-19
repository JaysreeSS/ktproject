---
description: Set up Supabase tables for KT project management
---
1. **Create Supabase project**
   - Sign in to https://supabase.com and create a new project.
   - Note the `API URL` and `anon public key` – replace the placeholders in `src/contexts/ProjectContext.jsx`.
2. **Create `projects` table**
   ```sql
   create table projects (
       id text primary key,
       name text not null,
       description text,
       managerId text not null,
       status text default 'In Progress',
       completion int default 0,
       createdAt timestamp default now(),
       updatedAt timestamp default now(),
       sections jsonb default '[]'::jsonb,
       members jsonb default '[]'::jsonb
   );
   ```
   - Enable `RLS` and add a policy that allows authenticated users to `select`, `insert`, `update`, `delete` where `managerId = auth.uid()` or `isAdmin = true`.
3. **Create `uploads` table (optional for file attachments)**
   ```sql
   create table uploads (
       id uuid default uuid_generate_v4() primary key,
       projectId text references projects(id),
       sectionId text,
       url text not null,
       uploadedAt timestamp default now()
   );
   ```
4. **Configure Supabase client**
   - In `src/contexts/ProjectContext.jsx` replace:
     ```js
     const supabaseUrl = "https://YOUR_SUPABASE_PROJECT.supabase.co";
     const supabaseAnonKey = "YOUR_PUBLIC_ANON_KEY";
     ```
     with the values from step 1.
5. **Run a quick sanity check**
   - Start the dev server (`npm run dev`).
   - Create a new project via the UI; it should appear in the Supabase `projects` table.
   - Edit a section or add a comment; the changes should be persisted.
6. **Optional: Enable storage for file uploads**
   - In Supabase dashboard, go to **Storage** → **Buckets** → **Create bucket** (e.g., `kt-uploads`).
   - Use the bucket URL when uploading files and store the URL in the `uploads` table.

Once the tables are created and the client keys are set, the application will automatically sync newly created projects, updates, and comments with Supabase.
