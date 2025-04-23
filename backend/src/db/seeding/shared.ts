import { shortlistedCleanersTable } from "../schema/shortlistedCleaners"
import { serviceCategoriesTable } from "../schema/serviceCategories"
import { servicesProvidedTable } from "../schema/servicesProvided"
import { serviceBookingsTable } from "../schema/serviceBookings"
import { userAccountsTable } from "../schema/userAccounts"
import { userProfilesTable } from "../schema/userProfiles"
import { DrizzleClient } from "../../shared/constants"
import { sql } from "drizzle-orm"

export const clearTheDatabase = async (db: DrizzleClient): Promise<void> => {
    await db.execute(sql`
        TRUNCATE TABLE 
        ${userProfilesTable},
        ${userAccountsTable},
        ${serviceBookingsTable},
        ${servicesProvidedTable},
        ${serviceCategoriesTable},
        ${shortlistedCleanersTable}
        RESTART IDENTITY CASCADE;
    `)
}

export const createProfileIdMappings = async (db: DrizzleClient): Promise<Map<string, number>> => {
    const mapping = new Map<string, number>()
    const result = await db.select().from(userProfilesTable)
    result.forEach(res => mapping.set(res.label, res.id))
    return mapping
}
