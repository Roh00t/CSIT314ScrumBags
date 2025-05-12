import { integer, pgTable, timestamp, index, serial, varchar } from 'drizzle-orm/pg-core'
import { servicesProvidedTable } from './servicesProvided'
// import { bookingStatusEnum } from './bookingStatusEnum'
import { userAccountsTable } from './userAccounts'
import { relations } from 'drizzle-orm'

export const serviceBookingsTable = pgTable(
    'service_bookings',
    {
        id: serial().primaryKey(),
        homeownerID: integer()
            .notNull()
            .references(() => userAccountsTable.id, { onDelete: 'cascade' }),
        serviceProvidedID: integer()
            .notNull()
            .references(() => servicesProvidedTable.id, {
                onDelete: 'cascade'
            }),
        startTimestamp: timestamp({
            mode: 'date',
            withTimezone: true
        }).notNull(),
        status: varchar().notNull().default("Confirmed")
        // status: bookingStatusEnum().notNull()
    },
    table => [
        index().on(table.status) // Want to be able to filter bookings that are "completed"
    ]
)

export const serviceBookingRelations = relations(
    serviceBookingsTable,
    ({ one }) => ({
        homeowner: one(userAccountsTable, {
            fields: [serviceBookingsTable.homeownerID],
            references: [userAccountsTable.id]
        }),
        serviceProvided: one(servicesProvidedTable, {
            fields: [serviceBookingsTable.serviceProvidedID],
            references: [servicesProvidedTable.id]
        })
    })
)

export type ServiceBookingsInsert = typeof serviceBookingsTable.$inferInsert
export type ServiceBookingsSelect = typeof serviceBookingsTable.$inferSelect