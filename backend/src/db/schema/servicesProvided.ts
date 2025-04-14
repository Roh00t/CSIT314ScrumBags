import { pgTable, integer } from 'drizzle-orm/pg-core'
import { servicesTable } from './services'
import { userAccountsTable } from './userAccounts'

export const servicesProvidedTable = pgTable(
    'services_provided',
    {
        cleanerID: integer()
            .notNull()
            .references(() => userAccountsTable.id, { onDelete: 'cascade' }),
        serviceID: integer()
            .notNull()
            .references(() => servicesTable.id, { onDelete: 'cascade' })
    }
)
