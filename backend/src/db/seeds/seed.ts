import { shortlistedCleanersTable } from '../schema/shortlistedCleaners'
import { servicesProvidedTable } from '../schema/servicesProvided'
import { serviceBookingsTable } from '../schema/serviceBookings'
import { BookingStatus } from '../schema/bookingStatusEnum'
import { userAccountsTable } from '../schema/userAccounts'
import { userProfilesTable } from '../schema/userProfiles'
import { drizzle } from 'drizzle-orm/node-postgres'
import { servicesTable } from '../schema/services'
import { GLOBALS } from '../../shared/constants'
import { faker } from '@faker-js/faker'
import { eq, sql } from 'drizzle-orm'
import bcrypt from 'bcrypt'
import 'dotenv/config'

const NO_OF_HOMEOWNERS = 45
const NO_OF_CLEANERS = 45
const NO_OF_PLATFORM_MANAGERS = 3
const NO_OF_USER_ADMINS = 7

const NO_OF_SERVICE_BOOKINGS = 100

// Ranges from 0-1. The chance of generating a 'suspended' user account
const HOMEOWNER_SUSPENSION_CHANCE = 0.18
const CLEANER_SUSPENSION_CHANCE = 0.1
//-----------------------------------------------------------------------
const db = drizzle(process.env.DATABASE_URL!)

const createProfileIdMappings = async (): Promise<Map<string, number>> => {
    const result = await db.select().from(userProfilesTable)

    const mapping = new Map<string, number>()
    result.forEach((res) => mapping.set(res.label, res.id))
    return mapping
}

const generateUserAccounts = async (
    count: number,
    userProfile: string,
    suspendChance: number = 0
): Promise<UserAccountSelect[]> => {
    const profileMappings = await createProfileIdMappings()
    const userProfileID = profileMappings.get(userProfile) as number

    const homeOwnersToInsert: UserAccountInsert[] = []
    for (let i = 0; i < count; i++) {
        const userAndPass = faker.internet.username()
        homeOwnersToInsert.push({
            username: userAndPass,
            password: await bcrypt.hash(userAndPass, GLOBALS.SALT_ROUNDS),
            userProfileId: userProfileID,
            isSuspended: faker.number.float({ min: 0, max: 1 }) < suspendChance
        })
    }
    return await db
        .insert(userAccountsTable)
        .values(homeOwnersToInsert)
        .onConflictDoNothing()
        .returning()
}

const main = async (): Promise<void> => {
    // ------ Clear the database
    await db.execute(sql`
        TRUNCATE TABLE 
        ${servicesTable},
        ${userAccountsTable},
        ${serviceBookingsTable},
        ${servicesProvidedTable},
        ${shortlistedCleanersTable}
        RESTART IDENTITY CASCADE;
    `)

    // ----- Generate a bunch of random user accounts
    const allHomeowners = await generateUserAccounts(
        NO_OF_HOMEOWNERS,
        'homeowner',
        HOMEOWNER_SUSPENSION_CHANCE
    )
    const allCleaners = await generateUserAccounts(
        NO_OF_CLEANERS,
        'cleaner',
        CLEANER_SUSPENSION_CHANCE
    )
    await generateUserAccounts(NO_OF_PLATFORM_MANAGERS, 'platform manager')
    await generateUserAccounts(NO_OF_USER_ADMINS, 'user admin')

    // ----- Generate a bunch of random services
    // const randomServices = Array.from({ length: NO_OF_SERVICES }).map(_ => {
    //     return { label: faker.word.noun() }
    // })
    // await db.insert(servicesTable).values(randomServices).onConflictDoNothing()
    await db
        .insert(servicesTable)
        .values([
            { label: 'Fan' },
            { label: 'Floor' },
            { label: 'Toilet' },
            { label: 'Carpet' },
            { label: 'Window' }
        ])
        .onConflictDoNothing()

    // ------ Create a bunch of random 'services provided' for each cleaner
    const allServices = await db.select().from(servicesTable)

    for (const cleaner of allCleaners) {
        const randomServicesSubset = faker.helpers.arrayElements(allServices, {
            min: 0,
            max: allServices.length
        })

        const servicesProvided: ServiceProvidedInsert[] = []
        for (const service of randomServicesSubset) {
            servicesProvided.push({
                cleanerID: cleaner.id as number,
                serviceID: service.id as number,
                description: faker.commerce.productDescription(),
                price: faker.number
                    .float({
                        min: 20,
                        max: 150,
                        fractionDigits: 2
                    })
                    .toString()
            } as ServiceProvidedInsert)
        }

        if (servicesProvided.length === 0) {
            continue
        }
        await db
            .insert(servicesProvidedTable)
            .values(servicesProvided)
            .onConflictDoNothing()
    }

    // ------ Create a bunch of random 'service bookings'
    const randomBookings: ServiceBookingInsert[] = []
    for (let i = 0; i < NO_OF_SERVICE_BOOKINGS;) {
        const randomCleanerID = faker.helpers.arrayElement(allCleaners).id
        const servicesByCleaner = await db
            .select({
                id: servicesTable.id,
                label: servicesTable.label
            })
            .from(servicesProvidedTable)
            .leftJoin(servicesTable,
                eq(
                    servicesProvidedTable.serviceID,
                    servicesTable.id
                ))
            .where(
                eq(servicesProvidedTable.cleanerID, randomCleanerID)
            )

        // If cleaner of "randomCleanerID" doesn't provide any services...
        // Just skip
        if (servicesByCleaner.length === 0) {
            continue
        }

        randomBookings.push({
            homeownerID: faker.helpers.arrayElement(allHomeowners).id,
            cleanerID: randomCleanerID,
            serviceID: faker.helpers.arrayElement(servicesByCleaner).id,
            startTimestamp: faker.date.anytime(),
            status: faker.helpers.arrayElement([
                BookingStatus.Requested,
                BookingStatus.Accepted,
                BookingStatus.Rejected,
                BookingStatus.Pending,
                BookingStatus.Cancelled,
                BookingStatus.Done
            ])
        } as ServiceBookingInsert)
        i++ // Only increment when a service is actually added
    }
    if (randomBookings.length > 0) {
        await db
            .insert(serviceBookingsTable)
            .values(randomBookings)
            .onConflictDoNothing()
    }

    // ------ Create a bunch of 'shortlist' entries
    for (const homeowner of allHomeowners) {
        const cleanersToShortlist = faker.helpers
            .arrayElements(allCleaners, {
                min: 0,
                max: allCleaners.length
            })
            .map(cleaner => {
                return {
                    homeownerID: homeowner.id,
                    cleanerID: cleaner.id
                } as ShortlistedCleanersInsert
            })
        if (cleanersToShortlist.length === 0) {
            continue
        }
        await db
            .insert(shortlistedCleanersTable)
            .values(cleanersToShortlist)
            .onConflictDoNothing()
    }
    console.log('Successfully seeded the database')
}

try {
    main()
} catch (err) {
    console.error('Error with seeding the database: ', (err as Error).message)
}

type ServiceSelect = typeof servicesTable.$inferSelect
type UserAccountInsert = typeof userAccountsTable.$inferInsert
type UserAccountSelect = typeof userAccountsTable.$inferSelect
type ServiceBookingInsert = typeof serviceBookingsTable.$inferInsert
type ServiceProvidedInsert = typeof servicesProvidedTable.$inferInsert
type ShortlistedCleanersInsert = typeof shortlistedCleanersTable.$inferInsert
