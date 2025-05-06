import { shortlistedServicesTable } from "../db/schema/shortlistedServices"
import { ServiceAlreadyShortlistedError } from "../shared/exceptions"
import { servicesProvidedTable } from "../db/schema/servicesProvided"
import { userAccountsTable } from "../db/schema/userAccounts"
import { drizzle } from "drizzle-orm/node-postgres"
import { DrizzleClient } from "../shared/constants"
import { and, count, eq, ilike } from "drizzle-orm"

export class ShortlistedServices {
    private db: DrizzleClient

    constructor() {
        this.db = drizzle(process.env.DATABASE_URL!)
    }

    /**
     * US-21: As a cleaner, I want to know the number of homeowners that shortlisted 
     *        me for my services, so that I can track my popularity and potential bookings
     */
    public async viewNoOfShortlistedHomeowners(
        serviceProvidedID: number
    ): Promise<number> {
        const [res] = await this.db
            .select({ count: count() })
            .from(shortlistedServicesTable)
            .where(eq(shortlistedServicesTable.serviceProvidedID, serviceProvidedID))

        return res.count
    }

    /**
     * US-26: As a homeowner, I want to save the cleaners into my short list 
     *        so that I can have an easier time for future reference
     */
    public async addToShortlist(
        homeownerID: number,
        serviceProvidedID: number
    ): Promise<void> {
        const result = await this.db
            .select()
            .from(shortlistedServicesTable)
            .leftJoin(userAccountsTable, eq(
                shortlistedServicesTable.serviceProvidedID,
                userAccountsTable.id
            ))
            .where(and(
                eq(shortlistedServicesTable.homeownerID, homeownerID),
                eq(shortlistedServicesTable.serviceProvidedID, serviceProvidedID)
            ))
            .limit(1)

        if (result.length > 0) {
            throw new ServiceAlreadyShortlistedError()
        }

        await this.db
            .insert(shortlistedServicesTable)
            .values({
                homeownerID: homeownerID,
                serviceProvidedID: serviceProvidedID
            })
    }

    /**
     * US-28: As a homeowner, I want to view my shortlist so that I 
     *        can have an easy time looking for a cleaner or service
     */
    public async viewShortlist(homeownerID: number): Promise<string[]> {
        const shortlistedCleaners = await this.db
            .select({ cleanerID: shortlistedServicesTable.serviceProvidedID })
            .from(shortlistedServicesTable)
            .where(eq(shortlistedServicesTable.homeownerID, homeownerID))

        // Retrieve cleaner names based on the cleanerIDs from shortlistedCleaners
        const cleanerNames = await Promise.all(shortlistedCleaners.map(async (entry) => {
            const [cleaner] = await this.db
                .select({ cleanerName: userAccountsTable.username })
                .from(userAccountsTable)
                .where(eq(userAccountsTable.id, entry.cleanerID))

            return cleaner?.cleanerName || "Unknown Cleaner"
        }));

        return cleanerNames
    }

    /**
     * US-27: As a homeowner, I want to search through my shortlist so that 
     *        I can find a specific cleaner or service I want
     */
    public async searchShortlist(
        homeownerID: number,
        search: string
    ): Promise<string[]> {
        const shortlistedCleaners = await this.db
            .select({ cleanerName: userAccountsTable.username })
            .from(shortlistedServicesTable)
            .leftJoin(servicesProvidedTable, eq(
                shortlistedServicesTable.serviceProvidedID,
                servicesProvidedTable.cleanerID
            ))
            .leftJoin(userAccountsTable, eq(
                shortlistedServicesTable.serviceProvidedID,
                userAccountsTable.id
            ))
            .where(and(
                eq(shortlistedServicesTable.homeownerID, homeownerID),
                ilike(userAccountsTable.username, `%${search}%`),
            ))
            .groupBy(userAccountsTable.username)

        return shortlistedCleaners.map(cl => cl.cleanerName || "Unknown Cleaner")
    }
}