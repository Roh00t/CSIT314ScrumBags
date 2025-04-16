import { pgTable, integer, text, numeric } from 'drizzle-orm/pg-core'
import { userAccountsTable } from './userAccounts'
import { servicesTable } from './services'

export const servicesProvidedTable = pgTable('services_provided', {
    cleanerID: integer()
        .notNull()
        .references(() => userAccountsTable.id, { onDelete: 'cascade' }),
    serviceID: integer()
        .notNull()
        .references(() => servicesTable.id, { onDelete: 'cascade' }),
    description: text(),
    price: numeric().notNull()
})
