import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  integer,
  boolean,
  uuid,
  decimal,
  jsonb,
  pgEnum,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type { AdapterAccount } from "next-auth/adapters";

export const userRoleEnum = pgEnum("user_role", [
  "customer",
  "driver",
  "owner",
  "admin",
]);

export const bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "awaiting_driver",
  "awaiting_owner",
  "approved",
  "rejected",
  "cancelled",
  "completed",
]);

export const driverVerificationStatusEnum = pgEnum("driver_verification_status", [
  "pending",
  "verified",
  "rejected",
]);

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  password: text("password"), // For credentials login
  role: userRoleEnum("role").default("customer").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const customerProfiles = pgTable("customer_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  phoneNumber: varchar("phone_number", { length: 20 }),
  address: text("address"),
});

export const driverProfiles = pgTable("driver_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  licenseNumber: varchar("license_number", { length: 50 }).notNull(),
  identityDocumentUrl: text("identity_document_url"),
  licenseDocumentUrl: text("license_document_url"),
  verificationStatus: driverVerificationStatusEnum("verification_status")
    .default("pending")
    .notNull(),
  experienceYears: integer("experience_years"),
  bio: text("bio"),
});

export const vehicleOwners = pgTable("vehicle_owners", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  businessName: varchar("business_name", { length: 255 }),
  isVerified: boolean("is_verified").default(false).notNull(),
});

export const vehicles = pgTable("vehicles", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: uuid("owner_id")
    .references(() => vehicleOwners.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  registrationNumber: varchar("registration_number", { length: 50 }).notNull().unique(),
  make: varchar("make", { length: 100 }),
  model: varchar("model", { length: 100 }),
  year: integer("year"),
  capacity: integer("capacity").notNull(),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  operatingArea: varchar("operating_area", { length: 255 }),
  description: text("description"),
  features: jsonb("features"),
  status: varchar("status", { length: 20 }).default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const vehicleImages = pgTable("vehicle_images", {
  id: uuid("id").defaultRandom().primaryKey(),
  vehicleId: uuid("vehicle_id")
    .references(() => vehicles.id, { onDelete: "cascade" })
    .notNull(),
  url: text("url").notNull(),
  isMain: boolean("is_main").default(false).notNull(),
});

export const vehicleDrivers = pgTable("vehicle_drivers", {
  id: uuid("id").defaultRandom().primaryKey(),
  vehicleId: uuid("vehicle_id")
    .references(() => vehicles.id, { onDelete: "cascade" })
    .notNull(),
  driverId: uuid("driver_id")
    .references(() => driverProfiles.id, { onDelete: "cascade" })
    .notNull(),
  assignedAt: timestamp("assigned_at").defaultNow().notNull(),
});

export const driverAvailability = pgTable("driver_availability", {
  id: uuid("id").defaultRandom().primaryKey(),
  driverId: uuid("driver_id")
    .references(() => driverProfiles.id, { onDelete: "cascade" })
    .notNull(),
  date: timestamp("date", { mode: "string" }).notNull(),
  isAvailable: boolean("is_available").notNull(),
  reason: text("reason"),
});

export const bookings = pgTable("bookings", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerId: uuid("customer_id")
    .references(() => customerProfiles.id)
    .notNull(),
  vehicleId: uuid("vehicle_id")
    .references(() => vehicles.id)
    .notNull(),
  driverId: uuid("driver_id")
    .references(() => driverProfiles.id)
    .notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  pickupLocation: text("pickup_location").notNull(),
  destination: text("destination").notNull(),
  eventType: varchar("event_type", { length: 100 }),
  passengerCount: integer("passenger_count"),
  requirements: text("requirements"),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  status: bookingStatusEnum("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  adminId: text("admin_id").references(() => users.id),
  action: text("action").notNull(),
  entityType: varchar("entity_type", { length: 50 }),
  entityId: uuid("entity_id"),
  details: jsonb("details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  customerProfile: one(customerProfiles, {
    fields: [users.id],
    references: [customerProfiles.userId],
  }),
  driverProfile: one(driverProfiles, {
    fields: [users.id],
    references: [driverProfiles.userId],
  }),
  vehicleOwner: one(vehicleOwners, {
    fields: [users.id],
    references: [vehicleOwners.userId],
  }),
  notifications: many(notifications),
}));

export const vehiclesRelations = relations(vehicles, ({ one, many }) => ({
  owner: one(vehicleOwners, {
    fields: [vehicles.ownerId],
    references: [vehicleOwners.id],
  }),
  images: many(vehicleImages),
  drivers: many(vehicleDrivers),
  bookings: many(bookings),
}));

export const vehicleImagesRelations = relations(vehicleImages, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [vehicleImages.vehicleId],
    references: [vehicles.id],
  }),
}));

export const driverProfilesRelations = relations(driverProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [driverProfiles.userId],
    references: [users.id],
  }),
  vehicles: many(vehicleDrivers),
  availability: many(driverAvailability),
  bookings: many(bookings),
}));

export const customerProfilesRelations = relations(customerProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [customerProfiles.userId],
    references: [users.id],
  }),
  bookings: many(bookings),
}));

export const vehicleOwnersRelations = relations(vehicleOwners, ({ one, many }) => ({
  user: one(users, {
    fields: [vehicleOwners.userId],
    references: [users.id],
  }),
  vehicles: many(vehicles),
}));

export const vehicleDriversRelations = relations(vehicleDrivers, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [vehicleDrivers.vehicleId],
    references: [vehicles.id],
  }),
  driver: one(driverProfiles, {
    fields: [vehicleDrivers.driverId],
    references: [driverProfiles.id],
  }),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [bookings.vehicleId],
    references: [vehicles.id],
  }),
  customer: one(customerProfiles, {
    fields: [bookings.customerId],
    references: [customerProfiles.id],
  }),
  driver: one(driverProfiles, {
    fields: [bookings.driverId],
    references: [driverProfiles.id],
  }),
}));
