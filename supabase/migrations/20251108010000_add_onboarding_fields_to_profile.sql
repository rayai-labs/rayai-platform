-- Add onboarding fields to profile table
ALTER TABLE "public"."profile" 
ADD COLUMN "company" text,
ADD COLUMN "job_title" text,
ADD COLUMN "ray_familiarity" text,
ADD COLUMN "project_description" text,
ADD COLUMN "onboarding_completed" boolean DEFAULT false;

-- Add index for onboarding_completed for efficient filtering
CREATE INDEX ON "public"."profile" (onboarding_completed);