//==================================================================================
const NO_OF_HOMEOWNERS = 20
const NO_OF_CLEANERS = 20
const NO_OF_PLATFORM_MANAGERS = 4
const NO_OF_USER_ADMINS = 6

const NO_OF_SERVICE_BOOKINGS = 100

// Ranges from 0-1. The chance of generating a 'suspended' user account
const HOMEOWNER_SUSPENSION_CHANCE = 0.18
const CLEANER_SUSPENSION_CHANCE = 0.1
//==================================================================================
import { presetServiceCategories, presetServiceNames } from './sensibleDefaults'
import { initServiceCategories, initServicesProvided } from './serviceHelpers'
import { createUserAccount, generateUserAccounts } from './userAccountHelpers'
import { userProfilesTable } from '../schema/userProfiles'
import { drizzle } from 'drizzle-orm/node-postgres'
import { clearTheDatabase } from './shared'
import 'dotenv/config'

const main = async (): Promise<void> => {
    const db = drizzle(process.env.DATABASE_URL!)
    await clearTheDatabase(db)

    // Insert default profiles
    await db.insert(userProfilesTable).values([
        { label: 'homeowner' },
        { label: 'cleaner' },
        { label: 'platform manager' },
        { label: 'user admin' }
    ]).onConflictDoNothing()

    // ---- Seed the preset user accounts
    await createUserAccount(db, "homeowner", "homeowner", "homeowner")
    await createUserAccount(db, "cleaner", "cleaner", "cleaner")
    await createUserAccount(db, "user admin", "user admin", "user admin")
    await createUserAccount(db, "platform manager", "platform manager", "platform manager")

    // ----- Generate a bunch of random user accounts
    const allHomeowners = await generateUserAccounts(
        db,
        NO_OF_HOMEOWNERS,
        'homeowner',
        HOMEOWNER_SUSPENSION_CHANCE
    )
    const allCleaners = await generateUserAccounts(
        db,
        NO_OF_CLEANERS,
        'cleaner',
        CLEANER_SUSPENSION_CHANCE
    )
    await generateUserAccounts(db, NO_OF_PLATFORM_MANAGERS, 'platform manager')
    await generateUserAccounts(db, NO_OF_USER_ADMINS, 'user admin')

    // ----- Generate a bunch of random service categories
    const serviceCategories = await initServiceCategories(db, presetServiceCategories)

    // ------ Create a bunch of random 'services provided' for each cleaner
    const servicesProvided = await initServicesProvided(
        db,
        allCleaners,
        serviceCategories,
        presetServiceNames
    )

    // ------ Create a bunch of random 'service bookings'
    // await initRandomBookings(allCleaners, allHomeowners)

    // ------ Create a bunch of 'shortlist' entries
    // await initShortlistEntries()

    console.log("Successfully seeded the database!")
}

try {
    main()
} catch (err) {
    console.error('Error with seeding the database: ', (err as Error).message)
}



// const initRandomBookings = async (
//     allCleaners: UserAccountsSelect[],
//     allHomeowners: UserAccountsSelect[]
// ): Promise<void> => {
//     const randomBookings: ServiceBookingInsert[] = []
//     while (randomBookings.length < NO_OF_SERVICE_BOOKINGS) {
//         const randomCleanerID = faker.helpers.arrayElement(allCleaners).id
//         const servicesByCleaner = await db
//             .select({
//                 id: servicesTable.id,
//                 label: servicesTable.label
//             })
//             .from(servicesProvidedTable)
//             .leftJoin(servicesTable,
//                 eq(
//                     servicesProvidedTable.serviceID,
//                     servicesTable.id
//                 ))
//             .where(
//                 eq(servicesProvidedTable.cleanerID, randomCleanerID)
//             )

//         // If cleaner of "randomCleanerID" doesn't provide any services...
//         // Just skip
//         if (servicesByCleaner.length === 0) {
//             continue
//         }

//         randomBookings.push({
//             homeownerID: faker.helpers.arrayElement(allHomeowners).id,
//             cleanerID: randomCleanerID,
//             serviceID: faker.helpers.arrayElement(servicesByCleaner).id,
//             startTimestamp: faker.date.anytime(),
//             status: faker.helpers.arrayElement([
//                 BookingStatus.Requested,
//                 BookingStatus.Accepted,
//                 BookingStatus.Rejected,
//                 BookingStatus.Pending,
//                 BookingStatus.Cancelled,
//                 BookingStatus.Done
//             ])
//         } as ServiceBookingInsert)
//     }
//     await db
//         .insert(serviceBookingsTable)
//         .values(randomBookings)
//         .onConflictDoNothing()
// }

// const initShortlistEntries = async (): Promise<void> => {
//     for (const homeowner of allHomeowners) {
//         const cleanersToShortlist = faker.helpers
//             .arrayElements(allCleaners, {
//                 min: 0,
//                 max: allCleaners.length
//             })
//             .map(cleaner => {
//                 return {
//                     homeownerID: homeowner.id,
//                     cleanerID: cleaner.id
//                 } as ShortlistedCleanersInsert
//             })
//         if (cleanersToShortlist.length === 0) {
//             continue
//         }
//         await db
//             .insert(shortlistedCleanersTable)
//             .values(cleanersToShortlist)
//             .onConflictDoNothing()
//     }
//     console.log('Successfully seeded the database')
// }

