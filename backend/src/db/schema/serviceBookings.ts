import { integer, pgTable, timestamp, index, serial } from 'drizzle-orm/pg-core'
import { userAccountsTable } from './userAccounts'
import { bookingStatusEnum } from './bookingStatusEnum'
import { servicesTable } from './services'

export const serviceBookingsTable = pgTable(
    'service_bookings',
    {
        id: serial().primaryKey(),
        homeownerID: integer()
            .notNull()
            .references(() => userAccountsTable.id, { onDelete: 'restrict' }),
        cleanerID: integer()
            .notNull()
            .references(() => userAccountsTable.id, { onDelete: 'restrict' }),
        categoryID: integer()
            .notNull()
            .references(() => servicesTable.id, {
                onDelete: 'restrict'
            }),
        startTimestamp: timestamp({
            mode: 'date',
            withTimezone: true
        }).notNull(),
        endTimestamp: timestamp({ mode: 'date', withTimezone: true }).notNull(),
        status: bookingStatusEnum().notNull()
    },
    (table) => [
        index().on(table.status) // Want to be able to filter bookings that are "completed"
    ]
)
