-- Create enum type for sandbox status
create type sandbox_status as enum ('active', 'stopped');

-- Create sandboxes table
create table "public"."sandboxes" (
  "id" uuid not null default gen_random_uuid(),
  "user_id" uuid not null,
  "status" sandbox_status not null default 'stopped',
  "created_at" timestamp with time zone default now(),
  "updated_at" timestamp with time zone default now()
);

-- Enable RLS
alter table "public"."sandboxes" enable row level security;

-- Add primary key constraint
alter table "public"."sandboxes" add constraint "sandboxes_pkey" PRIMARY KEY (id);

-- Add foreign key constraint to profiles table
alter table "public"."sandboxes" add constraint "sandboxes_user_id_fkey"
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Grant permissions to authenticated users
grant select on table "public"."sandboxes" to "authenticated";
grant insert on table "public"."sandboxes" to "authenticated";
grant update on table "public"."sandboxes" to "authenticated";
grant delete on table "public"."sandboxes" to "authenticated";

-- Grant full permissions to service role
grant all on table "public"."sandboxes" to "service_role";

-- RLS Policies
create policy "Users can view their own sandboxes"
on "public"."sandboxes"
as permissive
for select
to authenticated
using ((auth.uid() = user_id));

create policy "Users can create their own sandboxes"
on "public"."sandboxes"
as permissive
for insert
to authenticated
with check ((auth.uid() = user_id));

create policy "Users can update their own sandboxes"
on "public"."sandboxes"
as permissive
for update
to authenticated
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));

create policy "Users can delete their own sandboxes"
on "public"."sandboxes"
as permissive
for delete
to authenticated
using ((auth.uid() = user_id));

-- Trigger for updated_at timestamp
CREATE TRIGGER on_sandbox_updated
  BEFORE UPDATE ON public.sandboxes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
