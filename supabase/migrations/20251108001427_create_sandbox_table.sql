-- Create enum type for sandbox status
create type sandbox_status as enum ('active', 'stopped');

-- Create sandbox table
create table "public"."sandbox" (
  "id" uuid not null default gen_random_uuid(),
  "user_id" uuid not null,
  "status" sandbox_status not null default 'stopped',
  "created_at" timestamp with time zone default now(),
  "updated_at" timestamp with time zone default now(),
  constraint "sandbox_pkey" primary key (id),
  constraint "sandbox_user_id_fkey" foreign key (user_id) references public.profile(id) on delete cascade
);

-- Enable RLS
alter table "public"."sandbox" enable row level security;

-- Add index for user_id for performance on RLS policies
create index on "public"."sandbox" (user_id);

-- Grant permissions to authenticated users
grant select, insert, update, delete on table "public"."sandbox" to "authenticated";

-- Grant full permissions to service role
grant all on table "public"."sandbox" to "service_role";

-- RLS Policies
create policy "Users can view their own sandbox"
on "public"."sandbox"
as permissive
for select
to authenticated
using ((auth.uid() = user_id));

create policy "Users can create their own sandbox"
on "public"."sandbox"
as permissive
for insert
to authenticated
with check ((auth.uid() = user_id));

create policy "Users can update their own sandbox"
on "public"."sandbox"
as permissive
for update
to authenticated
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));

create policy "Users can delete their own sandbox"
on "public"."sandbox"
as permissive
for delete
to authenticated
using ((auth.uid() = user_id));

-- Trigger for updated_at timestamp
CREATE TRIGGER on_sandbox_updated
  BEFORE UPDATE ON public.sandbox
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
