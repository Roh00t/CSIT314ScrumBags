import { sql } from "drizzle-orm";
import {
    boolean,
    pgEnum,
    pgTable,
    serial,
    uuid,
    varchar,
    integer,
    timestamp
} from "drizzle-orm/pg-core"

export const bookingStatusEnum = pgEnum(
    'booking_status',
    ['requested', 'accepted', 'rejected', 'completed']
)

export const userProfilesTable = pgTable('user_profiles', {
    id: serial().primaryKey(),
    label: varchar({ length: 32 })
})

export const userAccountsTable = pgTable('user_accounts', {
    id: uuid().primaryKey().default(sql`gen_random_uuid()`),
    username: varchar({ length: 32 }).notNull(),
    password: varchar({ length: 64 }).notNull(),
    userProfileId: integer().notNull().references(() =>
        userProfilesTable.id, { onDelete: 'cascade' }
    ),
    isSuspended: boolean().notNull().default(false)
})

export const categoryTypesTable = pgTable('category_types', {
    id: serial().primaryKey(),
    label: varchar({ length: 32 }).notNull(),
    description: varchar({ length: 128 })
})

export const shortlistedCleanersTable = pgTable('shortlisted_cleaners', {
    homeownerID: uuid().notNull().references(() =>
        userAccountsTable.id, { onDelete: 'cascade' }
    ),
    cleanerID: uuid().notNull().references(() =>
        userAccountsTable.id, { onDelete: 'cascade' }
    ),
})

export const servicesOfferedTable = pgTable('services_offered', {
    cleanerID: uuid().notNull().references(() =>
        userAccountsTable.id, { onDelete: 'cascade' }
    ),
    serviceTypeID: integer().notNull().references(() =>
        categoryTypesTable.id, { onDelete: 'cascade' }
    ),
})

export const serviceBookingsTable = pgTable('service_bookings', {
    id: serial().primaryKey(),
    homeownerID: uuid().notNull().references(() =>
        userAccountsTable.id, { onDelete: 'restrict' }
    ),
    cleanerID: uuid().notNull().references(() =>
        userAccountsTable.id, { onDelete: 'restrict' }
    ),
    categoryID: integer().notNull().references(() =>
        categoryTypesTable.id, { onDelete: 'restrict' }
    ),
    startTimestamp: timestamp({ mode: 'date', withTimezone: true }).notNull(),
    endTimestamp: timestamp({ mode: 'date', withTimezone: true }).notNull(),
    status: bookingStatusEnum().notNull(),
})