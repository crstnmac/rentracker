DO $$ BEGIN
 CREATE TYPE "public"."payment_status" AS ENUM('pending', 'completed', 'failed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."property_status" AS ENUM('available', 'rented', 'sold', 'leased');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rentrack_email_verification_codes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(21) NOT NULL,
	"email" varchar(255) NOT NULL,
	"code" varchar(8) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	CONSTRAINT "rentrack_email_verification_codes_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rentrack_leases" (
	"id" varchar(15) PRIMARY KEY NOT NULL,
	"property_id" varchar,
	"tenant_id" varchar,
	"start_date" timestamp,
	"end_date" timestamp,
	"rent_amount" integer,
	"rent_due_day" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rentrack_notifications" (
	"id" varchar(15) PRIMARY KEY NOT NULL,
	"user_id" varchar,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"read" boolean DEFAULT false,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rentrack_password_reset_tokens" (
	"id" varchar(40) PRIMARY KEY NOT NULL,
	"user_id" varchar(21) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rentrack_payments" (
	"id" varchar(15) PRIMARY KEY NOT NULL,
	"lease_id" varchar,
	"amount" numeric(10, 2) NOT NULL,
	"payment_date" date NOT NULL,
	"status" "payment_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rentrack_posts" (
	"id" varchar(15) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"excerpt" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"status" varchar(10) DEFAULT 'draft' NOT NULL,
	"tags" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rentrack_properties" (
	"id" varchar(15) PRIMARY KEY NOT NULL,
	"landlord_id" varchar,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"price" integer NOT NULL,
	"location" varchar(255) NOT NULL,
	"address" varchar(255) NOT NULL,
	"city" varchar(100),
	"status" "property_status" DEFAULT 'available' NOT NULL,
	"state" varchar(100),
	"zip_code" varchar(20),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rentrack_sessions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(21) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rentrack_users" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"discord_id" varchar(255),
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"hashed_password" varchar(255),
	"avatar" varchar(255),
	"stripe_subscription_id" varchar(191),
	"stripe_price_id" varchar(191),
	"stripe_customer_id" varchar(191),
	"stripe_current_period_end" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"user_type" varchar(10) DEFAULT 'tenant',
	CONSTRAINT "rentrack_users_discord_id_unique" UNIQUE("discord_id"),
	CONSTRAINT "rentrack_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rentrack_leases" ADD CONSTRAINT "rentrack_leases_property_id_rentrack_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."rentrack_properties"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rentrack_leases" ADD CONSTRAINT "rentrack_leases_tenant_id_rentrack_users_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."rentrack_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rentrack_notifications" ADD CONSTRAINT "rentrack_notifications_user_id_rentrack_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."rentrack_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rentrack_payments" ADD CONSTRAINT "rentrack_payments_lease_id_rentrack_leases_id_fk" FOREIGN KEY ("lease_id") REFERENCES "public"."rentrack_leases"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rentrack_properties" ADD CONSTRAINT "rentrack_properties_landlord_id_rentrack_users_id_fk" FOREIGN KEY ("landlord_id") REFERENCES "public"."rentrack_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "verification_code_user_idx" ON "rentrack_email_verification_codes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "verification_code_email_idx" ON "rentrack_email_verification_codes" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "password_token_user_idx" ON "rentrack_password_reset_tokens" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "post_user_idx" ON "rentrack_posts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "post_created_at_idx" ON "rentrack_posts" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_user_idx" ON "rentrack_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_email_idx" ON "rentrack_users" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_discord_idx" ON "rentrack_users" USING btree ("discord_id");