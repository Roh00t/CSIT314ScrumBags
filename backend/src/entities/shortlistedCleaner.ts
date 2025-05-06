import { shortlistedCleanersTable } from "../db/schema/shortlistedCleaners"
import { CleanerAlreadyShortlistedError } from "../shared/exceptions"
import { servicesProvidedTable } from "../db/schema/servicesProvided"
import { userAccountsTable } from "../db/schema/userAccounts"
import { drizzle } from "drizzle-orm/node-postgres"
import { DrizzleClient } from "../shared/constants"
import { and, count, eq, ilike } from "drizzle-orm"

export class ShortlistedCleaner {
    private db: DrizzleClient

    constructor() {
        this.db = drizzle(process.env.DATABASE_URL!)
    }

    /**
     * US-21: As a cleaner, I want to know the number of homeowners that shortlisted 
     *        me for my services, so that I can track my popularity and potential bookings
     */
    public async viewNoOfShortlistedHomeowners(cleanerID: number): Promise<number> {
        const [shortlistedBookings] = await this.db.select({ count: count() })
            .from(shortlistedCleanersTable)
            .where(eq(shortlistedCleanersTable.cleanerID, cleanerID))
        return shortlistedBookings.count
    }

    /**
     * US-26: As a homeowner, I want to save the cleaners into my short list 
     *        so that I can have an easier time for future reference
     */
    public async addToShortlist(homeownerID: number, cleanerID: number): Promise<void> {
        const [result] = await this.db
            .select({ cleaner: userAccountsTable.username })
            .from(shortlistedCleanersTable)
            .leftJoin(userAccountsTable, eq(
                shortlistedCleanersTable.cleanerID,
                userAccountsTable.id
            ))
            .where(and(
                eq(shortlistedCleanersTable.homeownerID, homeownerID),
                eq(shortlistedCleanersTable.cleanerID, cleanerID)
            ))
            .limit(1)

        if (result) {
            throw new CleanerAlreadyShortlistedError(result.cleaner as string)
        }

        await this.db
            .insert(shortlistedCleanersTable)
            .values({ homeownerID, cleanerID })
    }

    /**
     * US-28: As a homeowner, I want to view my shortlist so that I 
     *        can have an easy time looking for a cleaner or service
     */
    public async viewShortlist(homeownerID: number): Promise<string[]> {
        const shortlistedCleaners = await this.db
            .select({ cleanerID: shortlistedCleanersTable.cleanerID })
            .from(shortlistedCleanersTable)
            .where(eq(shortlistedCleanersTable.homeownerID, homeownerID))

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
            .from(shortlistedCleanersTable)
            .leftJoin(servicesProvidedTable, eq(
                shortlistedCleanersTable.cleanerID,
                servicesProvidedTable.cleanerID
            ))
            .leftJoin(userAccountsTable, eq(
                shortlistedCleanersTable.cleanerID,
                userAccountsTable.id
            ))
            .where(and(
                eq(shortlistedCleanersTable.homeownerID, homeownerID),
                ilike(userAccountsTable.username, `%${search}%`),
            ))
            .groupBy(userAccountsTable.username)

        return shortlistedCleaners.map(cl => cl.cleanerName || "Unknown Cleaner")
    }
}