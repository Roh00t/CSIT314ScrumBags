import { servicesProvidedTable } from '../db/schema/servicesProvided'
import { ServiceNotFoundError } from '../exceptions/exceptions'
import { userAccountsTable } from '../db/schema/userAccounts'
import { servicesTable } from '../db/schema/services'
import { ServiceProvided } from '../shared/dataClasses'
import { drizzle } from 'drizzle-orm/node-postgres'
import { DrizzleClient } from '../shared/constants'
import { eq } from 'drizzle-orm'

export class Service {
    private db: DrizzleClient

    constructor() {
        this.db = drizzle(process.env.DATABASE_URL!)
    }

    public async createService(serviceName: string): Promise<void> {
        await this.db.insert(servicesTable).values({ label: serviceName })
    }

    public async viewServices(): Promise<string[]> {
        return (await this.db.select().from(servicesTable)).map((s) => s.label)
    }

    public async viewServicesProvided(
        userID: number
    ): Promise<ServiceProvided[]> {
        const servicesProvided = await this.db
            .select({
                serviceName: servicesTable.label,
                description: servicesProvidedTable.description,
                price: servicesProvidedTable.price
            })
            .from(userAccountsTable)
            .leftJoin(
                servicesProvidedTable,
                eq(userAccountsTable.id, servicesProvidedTable.cleanerID)
            )
            .leftJoin(
                servicesTable,
                eq(servicesProvidedTable.serviceID, servicesTable.id)
            )
            .where(eq(userAccountsTable.id, userID))

        return servicesProvided.map((so) => {
            return {
                serviceName: so.serviceName,
                description: so.description,
                price: Number(so.price)
            } as ServiceProvided
        })
    }

    public async createServiceProvided(
        userID: number,
        serviceName: string,
        description: string,
        price: number
    ): Promise<void> {
        const [serviceEntry] = await this.db
            .select({ id: servicesTable.id })
            .from(servicesTable)
            .where(eq(servicesTable.label, serviceName))

        if (!serviceEntry) {
            throw new ServiceNotFoundError(
                "Service '" + serviceName + "' not found"
            )
        }

        await this.db.insert(servicesProvidedTable).values({
            cleanerID: userID,
            serviceID: serviceEntry.id,
            description: description,
            price: price.toString()
        })
    }
}
