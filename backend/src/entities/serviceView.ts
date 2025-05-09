import { servicesProvidedTable } from "../db/schema/servicesProvided"
import { serviceViewsTable } from "../db/schema/serviceViews"
import { DrizzleClient } from "../shared/constants"
import { drizzle } from "drizzle-orm/node-postgres"
import { count, eq } from "drizzle-orm"

export class ServiceView {
    db: DrizzleClient

    constructor() {
        this.db = drizzle(process.env.DATABASE_URL!)
    }

    /**
     * US-20: As a cleaner, I want to view the number of homeowners interested in 
     *        my services, so that I can understand the demand of my services
     */
    async viewNumberOfInterestedHomeowners(serviceProvidedID: number): Promise<number> {
        const [result] = await this.db
            .select({ count: count() })
            .from(serviceViewsTable)
            .leftJoin(servicesProvidedTable, eq(
                serviceViewsTable.serviceProvidedID,
                servicesProvidedTable.id
            ))
            .where(eq(servicesProvidedTable.id, serviceProvidedID))

        return result.count
    }
}