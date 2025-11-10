-- Create api_key table
create table "public"."api_key" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid not null,
  "name" text not null,
  "key_hash" text not null,
  "key_prefix" text not null,
  "is_active" boolean default true,
  "created_at" timestamp with time zone default now(),
  "updated_at" timestamp with time zone default now(),
  "last_used_at" timestamp with time zone
);

alter table "public"."api_key" enable row level security;

alter table "public"."api_key" add constraint "api_key_pkey" PRIMARY KEY (id);

alter table "public"."api_key" add constraint "api_key_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profile(id) ON DELETE CASCADE not valid;

alter table "public"."api_key" validate constraint "api_key_user_id_fkey";

-- Updated_at trigger
CREATE TRIGGER on_api_key_updated
  BEFORE UPDATE ON public.api_key
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

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