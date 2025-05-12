import { ServicesProvidedSelect, servicesProvidedTable } from "../schema/servicesProvided"
import { ServiceViewsInsert, serviceViewsTable } from "../schema/serviceViews"
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

export const initServiceViews = async (
    db: DrizzleClient,
    allHomeowners: UserAccountsSelect[],
    allServicesProvided: ServicesProvidedSelect[]
): Promise<void> => {
    const viewsToAdd: ServiceViewsInsert[] = []

    // For later - the 'viewedAt' timestamp to only go back 2 years (change as necessary)
    const twoYearsAgo = new Date()
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2)

    allHomeowners.forEach(ho => {

        // Each home owner must view at least ONE service
        const servicesSubset = faker.helpers.arrayElements(
            allServicesProvided,
            { min: 1, max: allServicesProvided.length }
        )

        servicesSubset.forEach(svc => {
            // Each service viewed must be viewed at least ONCE
            const noOfViews = faker.number.int({ min: 1, max: 5 })

            for (let i = 0; i < noOfViews; i++) {
                viewsToAdd.push({
                    homeownerID: ho.id,
                    serviceProvidedID: svc.id,
                    viewedAt: faker.date.between({
                        from: twoYearsAgo,
                        to: new Date()
                    })
                })
            }
        })
    })

    await db
        .insert(serviceViewsTable)
        .values(viewsToAdd)
}