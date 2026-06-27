# 003 — Database Integration

## Goal
Establish database connectivity using Supabase. Persist companion profiles and capture memory reflections. Design the client integration to fall back automatically to local client-side storage if Supabase credentials are not configured, ensuring zero-friction local execution.

## Requirements
1. **Connectivity**:
   - Establish connection via a Client instance of the Supabase JS SDK.
   - Credentials must be read from:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. **Tables & Relations**:
   - `companions`:
     - `id`: primary key (UUID or text).
     - `name`: text.
     - `temperament`: text.
     - `created_at`: timestamp with time zone.
   - `companion_memories`:
     - `id`: primary key (UUID or text).
     - `companion_id`: foreign key to `companions.id` with cascade delete.
     - `content`: text (reflection text).
     - `quest_id`: text (identifier for the quest, e.g. `"notice_one_thing"`).
     - `created_at`: timestamp with time zone.
3. **Resilience & Fallback**:
   - If `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` are not set in the environment:
     - Log a warning: `“Supabase environment variables missing. Falling back to local storage.”`.
     - Automatically downgrade state actions to use the client-side `localStorage` provider.
4. **Types**:
   - Align TypeScript types (`Companion` and `CompanionMemory`) with the SQL fields.

## Acceptance Criteria
- Code compiles and builds cleanly without any errors.
- Schema file `supabase/schema.sql` and seed template `supabase/seed.sql` exist and contain correct SQL syntax.
- If credentials are provided, companion and memory inserts hit Supabase.
- If credentials are not provided, companion creation and quest completion continue to function normally using `localStorage` fallback.
