-- Create chat_rooms table for 1-on-1 or group conversations
CREATE TABLE public.chat_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    name TEXT, -- Optional for group chats
    type TEXT DEFAULT 'direct' CHECK (type IN ('direct', 'group'))
);

-- Create chat_participants table to link users to rooms
CREATE TABLE public.chat_participants (
    room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    PRIMARY KEY (room_id, user_id)
);

-- Create messages table
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Policies for chat_rooms
CREATE POLICY "Users can view rooms they are participating in"
ON public.chat_rooms FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.chat_participants
        WHERE room_id = id AND user_id = auth.uid()
    )
);

CREATE POLICY "Authenticated users can create rooms"
ON public.chat_rooms FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Policies for chat_participants
CREATE POLICY "Users can view participants of their rooms"
ON public.chat_participants FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.chat_participants cp
        WHERE cp.room_id = room_id AND cp.user_id = auth.uid()
    )
);

CREATE POLICY "Users can add participants to rooms"
ON public.chat_participants FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Policies for messages
CREATE POLICY "Users can view messages in their rooms"
ON public.messages FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.chat_participants
        WHERE room_id = messages.room_id AND user_id = auth.uid()
    )
);

CREATE POLICY "Users can send messages to their rooms"
ON public.messages FOR INSERT
WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
        SELECT 1 FROM public.chat_participants
        WHERE room_id = messages.room_id AND user_id = auth.uid()
    )
);

CREATE POLICY "Users can mark their messages as read" -- Or update logic
ON public.messages FOR UPDATE
USING (
    EXISTS (
       SELECT 1 FROM public.chat_participants
       WHERE room_id = messages.room_id AND user_id = auth.uid()
    )
);


-- Enable Realtime for these tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
