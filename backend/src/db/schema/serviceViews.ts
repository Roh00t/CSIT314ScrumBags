import { pgTable, integer, serial, timestamp } from 'drizzle-orm/pg-core'
import { servicesProvidedTable } from './servicesProvided'
import { userAccountsTable } from './userAccounts'

export const serviceViewsTable = pgTable('service_views', {
    id: serial().primaryKey(),
    homeownerID: integer()
        .notNull()
        .references(() => userAccountsTable.id, { onDelete: 'cascade' }),
    serviceProvidedID: integer()
        .notNull()
        .references(() => servicesProvidedTable.id, { onDelete: 'cascade' }),
    viewedAt: timestamp({ mode: 'date', withTimezone: true }).notNull(),
})

export type ServiceViewsInsert = typeof serviceViewsTable.$inferInsert
export type ServiceViewsSelect = typeof serviceViewsTable.$inferSelect