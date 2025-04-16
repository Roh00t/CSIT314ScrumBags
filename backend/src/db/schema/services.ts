import { pgTable, serial, uniqueIndex, varchar } from 'drizzle-orm/pg-core'
import { serviceBookingsTable } from './serviceBookings'
import { relations } from 'drizzle-orm'

export const servicesTable = pgTable(
    'services',
    {
        id: serial().primaryKey(),
        label: varchar({ length: 32 }).notNull().unique()
    },
    (table) => [uniqueIndex().on(table.label)]
)

export const serviceRelations = relations(servicesTable, ({ many }) => ({
    serviceBookings: many(serviceBookingsTable)
}))
