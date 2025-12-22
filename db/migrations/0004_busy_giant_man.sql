ALTER TABLE "webhook" RENAME COLUMN "secret" TO "secret_hash";--> statement-breakpoint
-- Drop the old jsonb column
ALTER TABLE "webhook" DROP COLUMN "events";--> statement-breakpoint

-- Create new text[] column
ALTER TABLE "webhook" ADD COLUMN "events" text[];--> statement-breakpoint
ALTER TABLE "webhook_log" ADD COLUMN "organization_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "webhook" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "webhook" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "webhook_log" ADD CONSTRAINT "webhook_log_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;