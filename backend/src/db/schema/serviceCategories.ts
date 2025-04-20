import { pgTable, serial, uniqueIndex, varchar } from 'drizzle-orm/pg-core'

export const serviceCategoriesTable = pgTable(
    'service_categories',
    {
        id: serial().primaryKey(),
        label: varchar({ length: 32 }).notNull().unique()
    },
    (table) => [uniqueIndex().on(table.label)]
)


