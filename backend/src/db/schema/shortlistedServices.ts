import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core'
import { servicesProvidedTable } from './servicesProvided'
import { userAccountsTable } from './userAccounts'

export const shortlistedServicesTable = pgTable('shortlisted_services', {
    homeownerID: integer()
        .notNull()
        .references(() => userAccountsTable.id, { onDelete: 'cascade' }),
    serviceProvidedID: integer()
        .notNull()
        .references(() => servicesProvidedTable.id, { onDelete: 'cascade' })
}, table => [
    primaryKey({ columns: [table.homeownerID, table.serviceProvidedID] })
])

export type ShortlistedServicesInsert = typeof shortlistedServicesTable.$inferInsert
export type ShortlistedServicesSelect = typeof shortlistedServicesTable.$inferSelect