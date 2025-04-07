import { sql } from "drizzle-orm";
import {
    boolean,
    pgEnum,
    pgTable,
    serial,
    text,
    uuid,
    varchar,
    primaryKey,
    index,
    integer,
    timestamp
} from "drizzle-orm/pg-core"

export const userRoleEnum = pgEnum(
    'user_role',
    ['homeowner', 'cleaner', 'user_admin', 'platform_manager']
);

export const bookingStatusEnum = pgEnum(
    'booking_status',
    ['requested', 'accepted', 'completed']
);

export const usersTable = pgTable('users', {
    id: uuid().primaryKey().default(sql`gen_random_uuid()`),
    username: text().notNull(),
    role: userRoleEnum().notNull(),
    isSuspended: boolean().notNull().default(false)
})

export const categoryTypesTable = pgTable('category_types', {
    id: serial().primaryKey(),
    label: varchar({ length: 32 }).notNull(),
    description: varchar({ length: 128 })
});

export const shortlistedCleanersTable = pgTable('shortlisted_cleaners', {
    homeownerId: uuid().notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
    cleanerId: uuid().notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
});

export const servicesOfferedTable = pgTable('services_offered', {
    cleanerId: uuid().notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
    serviceTypeId: integer().notNull().references(() => categoryTypesTable.id, { onDelete: 'cascade' }),
});

export const serviceBookingsTable = pgTable('service_bookings', {
    id: serial().primaryKey(),
    homeownerId: uuid().notNull().references(() => usersTable.id, { onDelete: 'restrict' }),
    cleanerId: uuid().notNull().references(() => usersTable.id, { onDelete: 'restrict' }),
    categoryId: integer().notNull().references(() => categoryTypesTable.id, { onDelete: 'restrict' }),
    startTimestamp: timestamp({ mode: 'date', withTimezone: true }).notNull(),
    endTimestamp: timestamp({ mode: 'date', withTimezone: true }).notNull(),
    status: bookingStatusEnum().notNull(),
})