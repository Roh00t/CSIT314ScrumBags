import { serviceCategoriesTable } from '../db/schema/serviceCategories'
import { servicesProvidedTable } from '../db/schema/servicesProvided'
import { drizzle } from 'drizzle-orm/node-postgres'
import { DrizzleClient } from '../shared/constants'
import { eq, ilike } from 'drizzle-orm'
import {
    ServiceCategoryAlreadyExistsError,
    ServiceCategoryNotFoundError
} from '../shared/exceptions'

export class ServiceCategory {
    private db: DrizzleClient

    constructor() {
        this.db = drizzle(process.env.DATABASE_URL!)
    }

    /**
     * US-33: As a Platform Manager, I want to create service categories, 
     *        to display more services which fit the requirements of our customers
     */
    public async createServiceCategory(category: string): Promise<void> {
        const [res] = await this.db
            .select()
            .from(serviceCategoriesTable)
            .where(eq(serviceCategoriesTable.label, category))
            .limit(1)

        if (res) {
            throw new ServiceCategoryAlreadyExistsError(category)
        }

        await this.db.insert(serviceCategoriesTable).values({ label: category })
    }

    /**
     * US-34: As a Platform Manager, I want to view current service 
     *        categories to see the current services provided
     * 
     * View all service 'categories' that exist
     */
    public async viewServiceCategories(): Promise<string[]> {
        const allServiceCategories = await this.db.select().from(serviceCategoriesTable)
        return allServiceCategories.map(sc => sc.label)
    }

    /**
     * US-35: As a Platform Manager, I want to update service categories 
     *        so that I can keep the available services accurate and up to date
     */
    public async updateServiceCategory(
        category: string,
        newCategory: string
    ): Promise<void> {
        await this.db
            .update(serviceCategoriesTable)
            .set({ label: newCategory })
            .where(eq(serviceCategoriesTable.label, category))
    }

    /**
     * US-36: As a Platform Manager, I want to delete service 
     *        categories to remove services no longer provided 
     */
    public async deleteServiceCategory(
        category: string
    ): Promise<void> {
        const arrayWhereLabelEqualsToCategory = await this.db
            .select()
            .from(serviceCategoriesTable)
            .where(eq(serviceCategoriesTable.label, category))

        if (arrayWhereLabelEqualsToCategory.length === 0) {
            throw new ServiceCategoryNotFoundError(category)
        }

        await this.db
            .delete(serviceCategoriesTable)
            .where(eq(serviceCategoriesTable.label, category))
    }

    /**
     * US-37: As a Platform Manager, I want to search service categories so 
     *        that I can quickly find and manage specific types of services 
     */
    public async searchServiceCategory(
        category: string
    ): Promise<string> {
        const [result] = await this.db
            .select()
            .from(serviceCategoriesTable)
            .where(ilike(serviceCategoriesTable.label, `%${category}%`))

        if (!result) {
            throw new ServiceCategoryNotFoundError(category)
        }
        return result.label
    }

    public async viewUniqueServicesProvided(): Promise<string[]> {
        const uniqueServices = await this.db
            .select({
                serviceName: servicesProvidedTable.serviceName,
            })
            .from(servicesProvidedTable)
            .groupBy(servicesProvidedTable.serviceName)

        return uniqueServices.map(service => service.serviceName)
    }
}


