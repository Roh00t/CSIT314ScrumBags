"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceBookingsTable = exports.servicesOfferedTable = exports.shortlistedCleanersTable = exports.categoryTypesTable = exports.userAccountsTable = exports.userProfilesTable = exports.bookingStatusEnum = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
exports.bookingStatusEnum = (0, pg_core_1.pgEnum)('booking_status', ['requested', 'accepted', 'rejected', 'completed']);
exports.userProfilesTable = (0, pg_core_1.pgTable)('user_profiles', {
    id: (0, pg_core_1.serial)().primaryKey(),
    label: (0, pg_core_1.varchar)({ length: 32 })
});
exports.userAccountsTable = (0, pg_core_1.pgTable)('user_accounts', {
    id: (0, pg_core_1.uuid)().primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    username: (0, pg_core_1.varchar)({ length: 32 }).notNull(),
    password: (0, pg_core_1.varchar)({ length: 64 }).notNull(),
    userProfileId: (0, pg_core_1.integer)().notNull().references(() => exports.userProfilesTable.id, { onDelete: 'cascade' }),
    isSuspended: (0, pg_core_1.boolean)().notNull().default(false)
});
exports.categoryTypesTable = (0, pg_core_1.pgTable)('category_types', {
    id: (0, pg_core_1.serial)().primaryKey(),
    label: (0, pg_core_1.varchar)({ length: 32 }).notNull(),
    description: (0, pg_core_1.varchar)({ length: 128 })
});
exports.shortlistedCleanersTable = (0, pg_core_1.pgTable)('shortlisted_cleaners', {
    homeownerID: (0, pg_core_1.uuid)().notNull().references(() => exports.userAccountsTable.id, { onDelete: 'cascade' }),
    cleanerID: (0, pg_core_1.uuid)().notNull().references(() => exports.userAccountsTable.id, { onDelete: 'cascade' }),
});
exports.servicesOfferedTable = (0, pg_core_1.pgTable)('services_offered', {
    cleanerID: (0, pg_core_1.uuid)().notNull().references(() => exports.userAccountsTable.id, { onDelete: 'cascade' }),
    serviceTypeID: (0, pg_core_1.integer)().notNull().references(() => exports.categoryTypesTable.id, { onDelete: 'cascade' }),
});
exports.serviceBookingsTable = (0, pg_core_1.pgTable)('service_bookings', {
    id: (0, pg_core_1.serial)().primaryKey(),
    homeownerID: (0, pg_core_1.uuid)().notNull().references(() => exports.userAccountsTable.id, { onDelete: 'restrict' }),
    cleanerID: (0, pg_core_1.uuid)().notNull().references(() => exports.userAccountsTable.id, { onDelete: 'restrict' }),
    categoryID: (0, pg_core_1.integer)().notNull().references(() => exports.categoryTypesTable.id, { onDelete: 'restrict' }),
    startTimestamp: (0, pg_core_1.timestamp)({ mode: 'date', withTimezone: true }).notNull(),
    endTimestamp: (0, pg_core_1.timestamp)({ mode: 'date', withTimezone: true }).notNull(),
    status: (0, exports.bookingStatusEnum)().notNull(),
});
//# sourceMappingURL=schema.js.map