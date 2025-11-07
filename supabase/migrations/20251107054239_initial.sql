
create table "public"."profiles" (
  "id" uuid not null,
  "email" text not null,
  "full_name" text,
  "avatar_url" text,
  "provider" text,
  "provider_id" text,
  "created_at" timestamp with time zone default now(),
  "updated_at" timestamp with time zone default now()
);

alter table "public"."profiles" enable row level security;

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY (id);

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url, provider, provider_id)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.raw_app_meta_data->>'provider',
        NEW.raw_user_meta_data->>'provider_id'
    );
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_user_metadata_sync()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    UPDATE public.profiles
    SET
        email = NEW.email,
        full_name = NEW.raw_user_meta_data->>'full_name',
        avatar_url = NEW.raw_user_meta_data->>'avatar_url'
    WHERE id = NEW.id;
    RETURN NEW;
END;
$function$
;

-- Grant permissions to authenticated users only
grant select on table "public"."profiles" to "authenticated";
grant insert on table "public"."profiles" to "authenticated";
grant update on table "public"."profiles" to "authenticated";
grant delete on table "public"."profiles" to "authenticated";

-- Grant full permissions to service role
grant all on table "public"."profiles" to "service_role";

-- RLS Policies
create policy "Users can view their own profile"
on "public"."profiles"
as permissive
for select
to authenticated
using ((auth.uid() = id));

create policy "Users can insert their own profile"
on "public"."profiles"
as permissive
for insert
to authenticated
with check ((auth.uid() = id));

create policy "Users can update their own profile"
on "public"."profiles"
as permissive
for update
to authenticated
using ((auth.uid() = id))
with check ((auth.uid() = id));

create policy "Users can delete their own profile"
on "public"."profiles"
as permissive
for delete
to authenticated
using ((auth.uid() = id));

-- Triggers
CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.raw_user_meta_data IS DISTINCT FROM NEW.raw_user_meta_data OR OLD.email IS DISTINCT FROM NEW.email)
  EXECUTE FUNCTION public.handle_user_metadata_sync();
