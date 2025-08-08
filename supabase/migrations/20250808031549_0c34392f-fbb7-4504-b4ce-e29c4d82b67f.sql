-- Create tables for chat conversations and messages with RLS
create extension if not exists pgcrypto;

-- Helper function to update updated_at
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Conversations table
create table if not exists public.chat_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.chat_conversations enable row level security;

-- Messages table
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.chat_conversations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  role text not null check (role in ('user','assistant','system')),
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.chat_messages enable row level security;

-- Triggers for updated_at
create or replace trigger trg_chat_conversations_updated_at
before update on public.chat_conversations
for each row execute function public.update_updated_at_column();

-- Indexes
create index if not exists idx_chat_conversations_user on public.chat_conversations(user_id);
create index if not exists idx_chat_messages_conversation on public.chat_messages(conversation_id);
create index if not exists idx_chat_messages_user on public.chat_messages(user_id);

-- RLS Policies
-- Conversations: authenticated users manage their own
create policy "Conversations are viewable by their owners"
  on public.chat_conversations
  for select
  using (auth.uid() is not null and user_id = auth.uid());

create policy "Users can insert their own conversations"
  on public.chat_conversations
  for insert
  with check (auth.uid() is not null and (user_id = auth.uid() or user_id is null));

create policy "Users can update their own conversations"
  on public.chat_conversations
  for update
  using (auth.uid() is not null and user_id = auth.uid());

create policy "Users can delete their own conversations"
  on public.chat_conversations
  for delete
  using (auth.uid() is not null and user_id = auth.uid());

-- Messages: only within conversations owned by the user
create policy "Users can view messages in their conversations"
  on public.chat_messages
  for select
  using (
    auth.uid() is not null and
    exists (
      select 1 from public.chat_conversations c
      where c.id = conversation_id and c.user_id = auth.uid()
    )
  );

create policy "Users can insert messages into their conversations"
  on public.chat_messages
  for insert
  with check (
    auth.uid() is not null and
    exists (
      select 1 from public.chat_conversations c
      where c.id = conversation_id and (c.user_id = auth.uid() or c.user_id is null)
    )
  );

create policy "Users can delete messages in their conversations"
  on public.chat_messages
  for delete
  using (
    auth.uid() is not null and
    exists (
      select 1 from public.chat_conversations c
      where c.id = conversation_id and c.user_id = auth.uid()
    )
  );
