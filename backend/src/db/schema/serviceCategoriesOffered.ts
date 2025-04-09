import { pgTable, uuid, integer } from "drizzle-orm/pg-core";
import { userAccountsTable } from "./userAccounts";
import { serviceCategoriesTable } from "./serviceCategories";

export const serviceCategoriesOfferedTable = pgTable('service_categories_offered', {
    cleanerID: uuid().notNull().references(() =>
        userAccountsTable.id, { onDelete: 'cascade' }
    ),
    serviceCategoryID: integer().notNull().references(() =>
        serviceCategoriesTable.id, { onDelete: 'cascade' }
    ),
})