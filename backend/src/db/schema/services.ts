import { integer, pgTable, serial, uniqueIndex, varchar } from 'drizzle-orm/pg-core'
import { serviceCategoriesTable } from './serviceCategories'
import { serviceBookingsTable } from './serviceBookings'
import { relations } from 'drizzle-orm'

export const servicesTable = pgTable(
    'services',
    {
        id: serial().primaryKey(),
        label: varchar({ length: 32 }).notNull().unique(),
        categoryID: integer().notNull()
            .references(() => serviceCategoriesTable.id, { onDelete: 'cascade' })
    },
    (table) => [uniqueIndex().on(table.label)]
)

export const serviceRelations = relations(servicesTable, ({ one, many }) => ({
    serviceBookings: many(serviceBookingsTable),
    serviceCategory: one(serviceCategoriesTable)
}))
