-- Seed data for Cabbits Database

-- Create a mock companion "Moss"
INSERT INTO public.companions (id, name, temperament, curiosity, insights_count, carrot_coins, cabbit_mood, cabbit_location, created_at)
VALUES (
    'a3b8c9d0-1234-5678-abcd-ef0123456789',
    'Moss',
    'curious',
    40,
    1,
    145,
    'idle',
    'rug',
    NOW() - INTERVAL '1 day'
)
ON CONFLICT (id) DO NOTHING;

-- Insert first quest memory for Moss
INSERT INTO public.companion_memories (companion_id, content, quest_id, created_at)
VALUES (
    'a3b8c9d0-1234-5678-abcd-ef0123456789',
    'Notice one thing: The companion noticed a small patch of moss on the windowsill and reflected that curiosity starts tiny.',
    'notice_one_thing',
    NOW()
);

-- Create a second mock companion "Echo"
INSERT INTO public.companions (id, name, temperament, curiosity, insights_count, carrot_coins, cabbit_mood, cabbit_location, created_at)
VALUES (
    'b4c9d0e1-2345-6789-bcde-f0123456789a',
    'Echo',
    'gentle',
    0,
    0,
    128,
    'idle',
    'rug',
    NOW() - INTERVAL '2 hours'
)
ON CONFLICT (id) DO NOTHING;
