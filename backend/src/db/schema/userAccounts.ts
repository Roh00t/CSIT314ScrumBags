import { relations } from "drizzle-orm";
import {
    boolean,
    pgTable,
    uuid,
    varchar,
    integer,
    uniqueIndex,
} from "drizzle-orm/pg-core"
import { userProfilesTable } from "./userProfiles";

export const userAccountsTable = pgTable('user_accounts', {
    id: uuid().defaultRandom().primaryKey(),
    username: varchar({ length: 32 }).notNull().unique(),
    password: varchar({ length: 128 }).notNull(),
    userProfileId: integer().notNull().references(() =>
        userProfilesTable.id, { onDelete: 'cascade' }
    ),
    isSuspended: boolean().notNull().default(false)
}, table => [
    uniqueIndex().on(table.username)
])

export const userAccountsRelations = relations(userAccountsTable, ({ one }) => ({
    userProfile: one(userProfilesTable, {
        fields: [userAccountsTable.userProfileId],
        references: [userProfilesTable.id]
    })
}))

export type UserAccountModel = typeof userAccountsTable.$inferSelect