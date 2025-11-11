-- Create api_key table
create table "public"."api_key" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid not null,
  "name" text not null,
  "key_hash" text not null,
  "created_at" timestamp with time zone default now(),
  "last_used_at" timestamp with time zone
);

alter table "public"."api_key" enable row level security;

alter table "public"."api_key" add constraint "api_key_pkey" PRIMARY KEY (id);

alter table "public"."api_key" add constraint "api_key_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profile(id) ON DELETE CASCADE;

alter table "public"."api_key" validate constraint "api_key_user_id_fkey";

-- Grant permissions
grant select on table "public"."api_key" to "authenticated";
grant insert on table "public"."api_key" to "authenticated";
grant update on table "public"."api_key" to "authenticated";
grant delete on table "public"."api_key" to "authenticated";
grant all on table "public"."api_key" to "service_role";

-- RLS Policies
create policy "Users can view their own API keys"
on "public"."api_key"
as permissive
for select
to authenticated
using ((auth.uid() = user_id));

create policy "Users can insert their own API keys"
on "public"."api_key"
as permissive
for insert
to authenticated
with check ((auth.uid() = user_id));

create policy "Users can update their own API keys"
on "public"."api_key"
as permissive
for update
to authenticated
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));

create policy "Users can delete their own API keys"
on "public"."api_key"
as permissive
for delete
to authenticated
using ((auth.uid() = user_id));