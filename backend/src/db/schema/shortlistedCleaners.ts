import { integer, pgTable, } from 'drizzle-orm/pg-core'
import { userAccountsTable } from './userAccounts'

export const shortlistedCleanersTable = pgTable('shortlisted_cleaners', {
    homeownerID: integer()
        .notNull()
        .references(() => userAccountsTable.id, { onDelete: 'cascade' }),
    cleanerID: integer()
        .notNull()
        .references(() => userAccountsTable.id, { onDelete: 'cascade' })
})
