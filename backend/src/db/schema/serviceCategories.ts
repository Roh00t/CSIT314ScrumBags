import { relations } from "drizzle-orm";
import { pgTable, serial, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { serviceBookingsTable } from "./serviceBookings";

export const serviceCategoriesTable = pgTable('service_categories', {
    id: serial().primaryKey(),
    label: varchar({ length: 32 }).notNull().unique(),
    description: varchar({ length: 128 })
}, table => [
    uniqueIndex().on(table.label)
])

export const serviceCategoriesRelations = relations(
    serviceCategoriesTable,
    ({ many }) => ({
        serviceBookings: many(serviceBookingsTable)
    })
)