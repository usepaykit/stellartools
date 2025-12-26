CREATE TABLE "password_reset_token" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"is_used" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"used_at" timestamp,
	CONSTRAINT "password_reset_token_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "password_reset_token" ADD CONSTRAINT "password_reset_token_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "password_reset_token_idx" ON "password_reset_token" USING btree ("token");--> statement-breakpoint
CREATE INDEX "password_reset_token_account_idx" ON "password_reset_token" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "password_reset_token_expires_idx" ON "password_reset_token" USING btree ("expires_at");