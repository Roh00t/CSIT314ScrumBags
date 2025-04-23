import { ServiceAlreadyProvidedError, ServiceCategoryNotFound, ServiceNotFoundError } from '../shared/exceptions'
import { serviceCategoriesTable } from '../db/schema/serviceCategories'
import { servicesProvidedTable } from '../db/schema/servicesProvided'
import { serviceBookingsTable } from '../db/schema/serviceBookings'
import { userAccountsTable } from '../db/schema/userAccounts'
import { ServiceData, ServiceProvidedData, ServiceHistory } from '../shared/dataClasses'
import { servicesTable } from '../db/schema/services'
import { drizzle } from 'drizzle-orm/node-postgres'
import { DrizzleClient } from '../shared/constants'
import { and, eq, gt, lt } from 'drizzle-orm'

export class Service {
    private db: DrizzleClient

    constructor() {
        this.db = drizzle(process.env.DATABASE_URL!)
    }

    public async createServiceCategory(
        categoryLabel: string
    ): Promise<void> {
        await this.db.insert(serviceCategoriesTable).values({ label: categoryLabel })
    }

    public async viewServiceCategories(): Promise<string[]> {
        const allServiceCategories = await this.db.select().from(serviceCategoriesTable)
        return allServiceCategories.map(sc => sc.label)
    }

    public async createService(serviceName: string, serviceCategory: string): Promise<void> {
        const [retrievedServiceCat] = await this.db
            .select()
            .from(serviceCategoriesTable)
            .where(eq(serviceCategoriesTable.label, serviceCategory))

        if (!retrievedServiceCat) {
            throw new ServiceCategoryNotFound(
                "Could not find service category of name: " + serviceCategory
            )
        }

        await this.db.insert(servicesTable).values({
            label: serviceName,
            categoryID: retrievedServiceCat.id
        })
    }

    public async viewServices(): Promise<ServiceData[]> {
        const allServices = await this.db
            .select({
                label: servicesTable.label,
                category: serviceCategoriesTable.label
            })
            .from(servicesTable)
            .leftJoin(serviceCategoriesTable,
                eq(
                    servicesTable.categoryID,
                    serviceCategoriesTable.id
                )
            )
        return allServices.map(s => {
            return {
                label: s.label,
                category: s.category
            } as ServiceData
        })
    }

    public async viewServicesProvided(
        userID: number
    ): Promise<ServiceProvidedData[]> {
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
            } as ServiceProvidedData
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

        const result = await this.db
            .select()
            .from(servicesProvidedTable)
            .where(
                and(
                    eq(servicesProvidedTable.cleanerID, userID),
                    eq(servicesProvidedTable.serviceID, serviceEntry.id)
                )
            )
        if (result.length > 0) {
            throw new ServiceAlreadyProvidedError(
                "Cleaner of ID " + userID + " already provides service '" + serviceName + "'"
            )
        }

        await this.db.insert(servicesProvidedTable).values({
            cleanerID: userID,
            serviceID: serviceEntry.id,
            description: description,
            price: price.toString()
        })
    }

    public async viewAllServiceHistory(
        userID: number
    ): Promise<ServiceHistory[]> {
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
                )
            )

        return results.map((so) => {
            return {
                cleanerName: so.cleanerName,
                serviceName: so.serviceName,
                date: so.date,
                price: so.price,
                status: so.status
            } as ServiceHistory
        })
    }

    // View & Search(by username) Service History filtered by service and date
    public async viewServiceHistory(
        userID: number,
        cleanerName: string | null,
        service: string,
        date: Date | string
    ): Promise<ServiceHistory[]> {
        const normalizedDate = typeof date === 'string' ? new Date(date) : date;
        const startOfDay = new Date(normalizedDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(startOfDay);
        endOfDay.setDate(endOfDay.getDate() + 1);
    
        // Dynamically build filter conditions
        const conditions = [
            eq(serviceBookingsTable.homeownerID, userID),
            eq(servicesTable.label, service),
            gt(serviceBookingsTable.startTimestamp, startOfDay),
            lt(serviceBookingsTable.startTimestamp, endOfDay),
        ];
    
        // Only add cleanerName filter if provided
        if (cleanerName) {
            conditions.push(eq(userAccountsTable.username, cleanerName));
        }
    
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
            .where(and(...conditions));
    
        // Handle no results
        if (results.length === 0) {
            throw new Error("No service history found for the given criteria.");
        }
    
        // Map and return results
        return results.map((result) => ({
            cleanerName: result.cleanerName,
            serviceName: result.serviceName,
            date: new Date(result.date),
            price: result.price,
            status: result.status
        }));
    }
}


