-- Cabbits Supabase Schema Template
-- Enable RLS and setup basic structures

-- Create companions table
CREATE TABLE IF NOT EXISTS public.companions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    temperament TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create companion_memories table
CREATE TABLE IF NOT EXISTS public.companion_memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    companion_id UUID NOT NULL REFERENCES public.companions(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    quest_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_memories_companion_id ON public.companion_memories(companion_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.companions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companion_memories ENABLE ROW LEVEL SECURITY;

-- Create simple development policies (Allowing all read/write operations for early development)
CREATE POLICY "Allow public read access to companions" ON public.companions
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to companions" ON public.companions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access to companions" ON public.companions
    FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access to companions" ON public.companions
    FOR DELETE USING (true);

CREATE POLICY "Allow public read access to memories" ON public.companion_memories
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to memories" ON public.companion_memories
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public delete access to memories" ON public.companion_memories
    FOR DELETE USING (true);
