import { servicesProvidedTable } from '../db/schema/servicesProvided'
import { ServiceNotFoundError } from '../exceptions/exceptions'
import { userAccountsTable } from '../db/schema/userAccounts'
import { servicesTable } from '../db/schema/services'
import { ServiceProvided } from '../shared/dataClasses'
import { serviceBookingsTable } from '../db/schema/serviceBookings'
import { drizzle } from 'drizzle-orm/node-postgres'
import { DrizzleClient } from '../shared/constants'
import { and, eq, gt, lt, sql } from 'drizzle-orm'

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

    public async viewServiceHistory(
        userID: number,
        service: string,
        date: Date | string
    ): Promise<string[]> {
        // Ensure date is a Date object
        let normalizedDate: Date;
        if (typeof date === 'string') {
            normalizedDate = new Date(date);
        } else {
            normalizedDate = date;
        }

        // Normalize the date to 00:00 and calculate the next day
        const startOfDay = new Date(normalizedDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(startOfDay);
        endOfDay.setDate(endOfDay.getDate() + 1);

        const results = await this.db
        .select({
            cleanerName: userAccountsTable.username,
            serviceName: servicesTable.label,
            date: serviceBookingsTable.startTimestamp,
            price: servicesProvidedTable.price,
            status: serviceBookingsTable.status
        })
        .from(serviceBookingsTable)
        .leftJoin(
            servicesTable,
            eq(servicesTable.id, serviceBookingsTable.serviceID)
        )
        .leftJoin(
            servicesProvidedTable,
            eq(servicesProvidedTable.serviceID, servicesTable.id)
        )
        .leftJoin(
            userAccountsTable,
            eq(userAccountsTable.id, servicesProvidedTable.cleanerID)
        )
        .where(
            and(
                eq(serviceBookingsTable.homeownerID, userID),
                eq(servicesTable.label, service),
                gt(serviceBookingsTable.startTimestamp, startOfDay),
                lt(serviceBookingsTable.startTimestamp, endOfDay)
            )
        )
    
        // Map the results to the desired format
        return results.map((temp1) => 
            `Service: ${temp1.serviceName}, Cleaner: ${temp1.cleanerName}, Date: ${new Date(temp1.date).toISOString()}, Price: $${temp1.price}, Status: ${temp1.status}`
        );
    }
}
