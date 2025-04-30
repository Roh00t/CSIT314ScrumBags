import { serviceCategoriesTable } from "../db/schema/serviceCategories"
import { servicesProvidedTable } from "../db/schema/servicesProvided"
import { ServiceCategoryNotFoundError } from "../shared/exceptions"
import { userAccountsTable } from "../db/schema/userAccounts"
import { AllServices, ServiceProvidedData } from "../shared/dataClasses"
import { drizzle } from "drizzle-orm/node-postgres"
import { DrizzleClient } from "../shared/constants"
import { and, eq } from "drizzle-orm"

export class ServiceProvided {
    private db: DrizzleClient

    constructor() {
        this.db = drizzle(process.env.DATABASE_URL!)
    }

    /**
     * US-13: As a cleaner, I want to create my service so 
     *        that homeowners can view my services provided 
     */
    public async createServiceProvided(
        cleanerID: number,
        serviceName: string,
        serviceCategory: string,
        description: string,
        price: number
    ): Promise<void> {
        const [serviceCategoryEntry] = await this.db
            .select()
            .from(serviceCategoriesTable)
            .where(eq(serviceCategoriesTable.label, serviceCategory))

        if (!serviceCategoryEntry) {
            throw new ServiceCategoryNotFoundError(serviceCategory)
        }

        // TODO: Clarify what are the rules of what can or cannot be duplicated
        // const serviceProvidedEntries = await this.db
        //     .select()
        //     .from(servicesProvidedTable)
        //     .where(
        //         and(
        //             eq(servicesProvidedTable.cleanerID, cleanerID),
        //             eq(servicesProvidedTable.serviceName, serviceName),
        //             eq(servicesProvidedTable.serviceCategoryID, serviceCategoryEntry.id)
        //         )
        //     )
        //
        // if (serviceProvidedEntries.length > 0) {
        //     throw new ServiceAlreadyProvidedError(
        //         "Cleaner of ID " + cleanerID + " already provides service '" + serviceName + "'"
        //     )
        // }

        await this.db.insert(servicesProvidedTable).values({
            cleanerID: cleanerID,
            serviceCategoryID: serviceCategoryEntry.id,
            serviceName: serviceName,
            description: description,
            price: price.toString()
        })
    }

    /**
     * US-14: As a cleaner, I want to view my service 
     *        so that I can check on my services provided
     * 
     * Gets all the service 'types' provided by a cleaner (by their userID)
     */
    public async viewServicesProvided(
        userID: number,
        serviceName: string | null
    ): Promise<ServiceProvidedData[]> {
        const conditions = [
            eq(userAccountsTable.id, userID)
        ];

        if (serviceName) {
            conditions.push(eq(servicesProvidedTable.serviceName, serviceName));
        }

        const servicesProvidedByCleaner = await this.db
            .select({
                serviceName: servicesProvidedTable.serviceName,
                description: servicesProvidedTable.description,
                price: servicesProvidedTable.price
            })
            .from(servicesProvidedTable)
            .leftJoin(userAccountsTable, eq(
                servicesProvidedTable.cleanerID,
                userAccountsTable.id
            ))
            .where(and(...conditions))

        return servicesProvidedByCleaner.map(sp => {
            return {
                serviceName: sp.serviceName,
                description: sp.description,
                price: Number(sp.price)
            } as ServiceProvidedData
        })
    }

    public async viewAllServicesProvided(): Promise<AllServices[]> {
        const allServicesProvided = await this.db
            .select({
                serviceid: servicesProvidedTable.id,
                serviceName: servicesProvidedTable.serviceName
            })
            .from(servicesProvidedTable)
        return allServicesProvided.map(sp => ({
            serviceName: sp.serviceName,
        }));
    }
}