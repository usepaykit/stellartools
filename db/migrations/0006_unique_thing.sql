CREATE TYPE "public"."feature" AS ENUM('aisdk', 'uploadthing');--> statement-breakpoint
CREATE TABLE "credit_balance" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"customer_id" text,
	"product_id" text,
	"network" "network" NOT NULL,
	"metadata" jsonb,
	"balance" integer DEFAULT 0 NOT NULL,
	"consumed" integer DEFAULT 0 NOT NULL,
	"granted" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "credit_balance_customer_id_product_id_network_unique" UNIQUE("customer_id","product_id","network")
);
--> statement-breakpoint
ALTER TABLE "usage_record" ALTER COLUMN "feature" SET DATA TYPE "public"."feature" USING "feature"::"public"."feature";--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "unit" text;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "units_per_credit" integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "credits_granted" integer;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "credit_expiry_days" integer;--> statement-breakpoint
ALTER TABLE "usage_record" ADD COLUMN "aisdk" jsonb;--> statement-breakpoint
ALTER TABLE "credit_balance" ADD CONSTRAINT "credit_balance_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit_balance" ADD CONSTRAINT "credit_balance_customer_id_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit_balance" ADD CONSTRAINT "credit_balance_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "credit_balance_customer_idx" ON "credit_balance" USING btree ("customer_id","organization_id");