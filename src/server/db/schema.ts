import { relations } from "drizzle-orm";
import {
  pgTableCreator,
  serial,
  boolean,
  index,
  text,
  timestamp,
  decimal,
  varchar,
  integer,
  date,
  pgEnum,
} from "drizzle-orm/pg-core";
import { DATABASE_PREFIX as prefix } from "@/lib/constants";

export const pgTable = pgTableCreator((name) => `${prefix}_${name}`);

export const users = pgTable(
  "users",
  {
    id: varchar("id", { length: 21 }).primaryKey(),
    discordId: varchar("discord_id", { length: 255 }).unique(),
    name: varchar("name", { length: 255 }),
    firstName: varchar("first_name", { length: 100 }),
    lastName: varchar("last_name", { length: 100 }),
    email: varchar("email", { length: 255 }).unique().notNull(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    hashedPassword: varchar("hashed_password", { length: 255 }),
    avatar: varchar("avatar", { length: 255 }),
    stripeSubscriptionId: varchar("stripe_subscription_id", { length: 191 }),
    stripePriceId: varchar("stripe_price_id", { length: 191 }),
    stripeCustomerId: varchar("stripe_customer_id", { length: 191 }),
    stripeCurrentPeriodEnd: timestamp("stripe_current_period_end"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).$onUpdate(() => new Date()),
    userType: varchar("user_type", { length: 10, enum: ["landlord", "tenant"] }).default("tenant"),
  },
  (t) => ({
    emailIdx: index("user_email_idx").on(t.email),
    discordIdx: index("user_discord_idx").on(t.discordId),
  }),
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const sessions = pgTable(
  "sessions",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    userId: varchar("user_id", { length: 21 }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
  },
  (t) => ({
    userIdx: index("session_user_idx").on(t.userId),
  }),
);

export const emailVerificationCodes = pgTable(
  "email_verification_codes",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 21 }).unique().notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    code: varchar("code", { length: 8 }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
  },
  (t) => ({
    userIdx: index("verification_code_user_idx").on(t.userId),
    emailIdx: index("verification_code_email_idx").on(t.email),
  }),
);

export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    id: varchar("id", { length: 40 }).primaryKey(),
    userId: varchar("user_id", { length: 21 }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
  },
  (t) => ({
    userIdx: index("password_token_user_idx").on(t.userId),
  }),
);

export const posts = pgTable(
  "posts",
  {
    id: varchar("id", { length: 15 }).primaryKey(),
    userId: varchar("user_id", { length: 255 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    excerpt: varchar("excerpt", { length: 255 }).notNull(),
    content: text("content").notNull(),
    status: varchar("status", { length: 10, enum: ["draft", "published"] })
      .default("draft")
      .notNull(),
    tags: varchar("tags", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).$onUpdate(() => new Date()),
  },
  (t) => ({
    userIdx: index("post_user_idx").on(t.userId),
    createdAtIdx: index("post_created_at_idx").on(t.createdAt),
  }),
);

export const postRelations = relations(posts, ({ one }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
}));

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

export const propertyStatus = pgEnum("property_status", ["available", "rented", "sold", "leased"]);

export const properties = pgTable("properties", {
  id: varchar("id", { length: 15 }).primaryKey(),
  landlordId: varchar("landlord_id").references(() => users.id),
  title: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  city: varchar("city", { length: 100 }),
  status: propertyStatus("status").default("available").notNull(),
  state: varchar("state", { length: 100 }),
  zipCode: varchar("zip_code", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  landlord: one(users, {
    fields: [properties.landlordId],
    references: [users.id],
  }),
  leases: many(leases),
}));

export const leases = pgTable("leases", {
  id: varchar("id", { length: 15 }).primaryKey(),
  propertyId: varchar("property_id").references(() => properties.id),
  tenantId: varchar("tenant_id").references(() => users.id),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  rentAmount: integer("rent_amount"),
  rentDueDay: integer("rent_due_day").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const leasesRelations = relations(leases, ({ one, many }) => ({
  property: one(properties, {
    fields: [leases.propertyId],
    references: [properties.id],
  }),
  tenant: one(users, {
    fields: [leases.tenantId],
    references: [users.id],
  }),
  payments: many(payments),
}));

export type Lease = typeof leases.$inferSelect;
export type NewLease = typeof leases.$inferInsert;

export const paymentStatus = pgEnum("payment_status", ["pending", "completed", "failed"]);

export const payments = pgTable("payments", {
  id: varchar("id", { length: 15 }).primaryKey(),
  leaseId: varchar("lease_id").references(() => leases.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentDate: date("payment_date").notNull(),
  status: paymentStatus("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const paymentsRelations = relations(payments, ({ one }) => ({
  lease: one(leases, {
    fields: [payments.leaseId],
    references: [leases.id],
  }),
}));

export const Payment = typeof payments.$inferSelect;
export const NewPayment = typeof payments.$inferInsert;

export const notifications = pgTable("notifications", {
  id: varchar("id", { length: 15 }).primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  read: boolean("read").default(false),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
