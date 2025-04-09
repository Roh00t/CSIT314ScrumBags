import { serial, pgTable, varchar, uniqueIndex } from "drizzle-orm/pg-core";

export const userProfilesTable = pgTable('user_profiles', {
    id: serial().primaryKey(),
    label: varchar({ length: 32 }).unique()
}, table => [
    uniqueIndex().on(table.label) // No good reason it SHOULDN'T be unique
])