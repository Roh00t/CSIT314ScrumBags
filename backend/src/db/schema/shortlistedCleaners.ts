import { pgTable, uuid } from "drizzle-orm/pg-core";
import { userAccountsTable } from "./userAccounts";

export const shortlistedCleanersTable = pgTable('shortlisted_cleaners', {
    homeownerID: uuid().notNull().references(() =>
        userAccountsTable.id, { onDelete: 'cascade' }
    ),
    cleanerID: uuid().notNull().references(() =>
        userAccountsTable.id, { onDelete: 'cascade' }
    ),
})