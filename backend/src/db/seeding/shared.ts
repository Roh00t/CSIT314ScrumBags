import { ServicesProvidedSelect, servicesProvidedTable } from "../schema/servicesProvided"
import { UserAccountsSelect, userAccountsTable } from "../schema/userAccounts"
import { serviceCategoriesTable } from "../schema/serviceCategories"
import { serviceBookingsTable } from "../schema/serviceBookings"
import { userProfilesTable } from "../schema/userProfiles"
import { DrizzleClient } from "../../shared/constants"
import { faker } from "@faker-js/faker"
import {
    ShortlistedServicesInsert,
    shortlistedServicesTable
} from "../schema/shortlistedServices"
import { sql } from "drizzle-orm"

export const clearTheDatabase = async (db: DrizzleClient): Promise<void> => {
    await db.execute(sql`
        TRUNCATE TABLE 
        ${userProfilesTable},
        ${userAccountsTable},
        ${serviceBookingsTable},
        ${servicesProvidedTable},
        ${serviceCategoriesTable},
        ${shortlistedServicesTable}
        RESTART IDENTITY CASCADE;
    `)
}

export const createProfileIdMappings = async (
    db: DrizzleClient
): Promise<Map<string, number>> => {
    const mapping = new Map<string, number>()
    const result = await db.select().from(userProfilesTable)
    result.forEach(res => mapping.set(res.label, res.id))
    return mapping
}

export const initShortlistEntries = async (
    db: DrizzleClient,
    allHomeowners: UserAccountsSelect[],
    allServicesProvided: ServicesProvidedSelect[]
): Promise<void> => {

    const shortlistEntriesToInsert: ShortlistedServicesInsert[] = []
    allHomeowners.forEach(ho => {
        faker.helpers.arrayElements(allServicesProvided, {
            min: 0, max: allServicesProvided.length
        }).forEach(sp => {
            shortlistEntriesToInsert.push({
                homeownerID: ho.id,
                serviceProvidedID: sp.id
            })
        })
    })

    await db
        .insert(shortlistedServicesTable)
        .values(shortlistEntriesToInsert)
        .onConflictDoNothing()
}