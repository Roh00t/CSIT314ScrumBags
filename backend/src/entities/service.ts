import { servicesProvidedTable } from "../db/schema/servicesProvided"
import { userAccountsTable } from "../db/schema/userAccounts"
import { servicesTable } from "../db/schema/services"
import { drizzle } from "drizzle-orm/node-postgres"
import { DrizzleClient } from "../shared/constants"
import { eq } from "drizzle-orm"
import { ServiceNotFoundError } from "../exceptions/exceptions"

export class Service {
    private db: DrizzleClient

    constructor() {
        this.db = drizzle(process.env.DATABASE_URL!)
    }

    public async createService(service: string): Promise<void> {
        await this.db.insert(servicesTable).values({ label: service })
    }

    public async viewServices(): Promise<string[]> {
        return (await this.db.select().from(servicesTable)).map(s => s.label)
    }

    public async viewServicesProvided(userID: number): Promise<string[]> {
        const servicesOffered = await this.db
            .select({
                serviceLabel: servicesTable.label
            })
            .from(userAccountsTable)
            .leftJoin(
                servicesProvidedTable,
                eq(
                    userAccountsTable.id,
                    servicesProvidedTable.cleanerID
                )
            )
            .leftJoin(
                servicesTable,
                eq(
                    servicesProvidedTable.serviceID,
                    servicesTable.id
                )
            )
            .where(eq(userAccountsTable.id, userID))

        return servicesOffered
            .filter(s => {
                return s.serviceLabel && s.serviceLabel.length > 0
            })
            .map(s => s.serviceLabel as string)
    }

    public async createServiceProvided(userID: number, service: string): Promise<void> {
        const [serviceEntry] = await this.db
            .select({ id: servicesTable.id })
            .from(servicesTable)
            .where(eq(servicesTable.label, service))

        if (!serviceEntry) {
            throw new ServiceNotFoundError("Service '" + service + "' not found")
        }

        await this.db
            .insert(servicesProvidedTable)
            .values({
                cleanerID: userID,
                serviceID: serviceEntry.id
            })
    }
}