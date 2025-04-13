import { integer, pgTable, uuid, timestamp, index } from 'drizzle-orm/pg-core'
import { userAccountsTable } from './userAccounts'
import { bookingStatusEnum } from './bookingStatusEnum'
import { serviceCategoriesTable } from './serviceCategories'

export const serviceBookingsTable = pgTable(
    'service_bookings',
    {
        id: uuid().defaultRandom().primaryKey(),
        homeownerID: uuid()
            .notNull()
            .references(() => userAccountsTable.id, { onDelete: 'restrict' }),
        cleanerID: uuid()
            .notNull()
            .references(() => userAccountsTable.id, { onDelete: 'restrict' }),
        categoryID: integer()
            .notNull()
            .references(() => serviceCategoriesTable.id, {
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
