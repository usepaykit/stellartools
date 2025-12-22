CREATE TYPE "public"."product_status" AS ENUM('active', 'archived');--> statement-breakpoint
CREATE TYPE "public"."refund_status" AS ENUM('pending', 'succeeded', 'failed');--> statement-breakpoint
CREATE TYPE "public"."team_invite_status" AS ENUM('pending', 'accepted', 'rejected');--> statement-breakpoint
CREATE TABLE "refund" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"payment_id" text NOT NULL,
	"customer_id" text,
	"asset_id" text,
	"amount" integer NOT NULL,
	"tx_hash" text NOT NULL,
	"reason" text,
	"status" "refund_status" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"network" "network" NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	CONSTRAINT "refund_tx_hash_unique" UNIQUE("tx_hash")
);
--> statement-breakpoint
CREATE TABLE "team_invite" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"email" text NOT NULL,
	"status" "team_invite_status" NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint
ALTER TABLE "checkout" RENAME COLUMN "price_id" TO "product_id";--> statement-breakpoint
ALTER TABLE "product" RENAME COLUMN "active" TO "images";--> statement-breakpoint
ALTER TABLE "checkout" ADD COLUMN "amount" integer;--> statement-breakpoint
ALTER TABLE "checkout" ADD COLUMN "asset_id" text;--> statement-breakpoint
ALTER TABLE "checkout" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "account_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "phone_number_required" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "status" "product_status" NOT NULL;--> statement-breakpoint
ALTER TABLE "refund" ADD CONSTRAINT "refund_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refund" ADD CONSTRAINT "refund_payment_id_payment_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refund" ADD CONSTRAINT "refund_customer_id_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refund" ADD CONSTRAINT "refund_asset_id_asset_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."asset"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_invite" ADD CONSTRAINT "team_invite_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "checkout" ADD CONSTRAINT "checkout_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "checkout" ADD CONSTRAINT "checkout_asset_id_asset_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."asset"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization" ADD CONSTRAINT "organization_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "checkout" ADD CONSTRAINT "amount_or_product_check" CHECK ("checkout"."product_id" IS NOT NULL OR "checkout"."amount" IS NOT NULL);