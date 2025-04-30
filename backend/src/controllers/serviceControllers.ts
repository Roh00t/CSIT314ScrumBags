import { AllServices, ServiceProvidedData } from '../shared/dataClasses'
import { Service } from '../entities/service'

/**
 * US-33: As a Platform Manager, I want to create service categories, 
 *        to display more services which fit the requirements of our customers
 */
export class CreateServiceCategoryController {
    private service: Service

    constructor() {
        this.service = new Service()
    }

    public async createServiceCategory(categoryLabel: string): Promise<void> {
        return await this.service.createServiceCategory(categoryLabel)
    }
}

/**
 * US-34: As a Platform Manager, I want to view current service 
 *        categories to see the current services provided
 * 
 * View all service 'categories' that exist
 */
export class ViewServiceCategoriesController {
    private service: Service

    constructor() {
        this.service = new Service()
    }

    public async viewServiceCategories(): Promise<string[]> {
        return await this.service.viewServiceCategories()
    }
}

/**
 * US-35: As a Platform Manager, I want to update service categories 
 *        so that I can keep the available services accurate and up to date
 */
export class UpdateServiceCategoryController {
    private service: Service

    constructor() {
        this.service = new Service()
    }

    public async updateServiceCategory(category: string, newCategory: string): Promise<void> {
        await this.service.updateServiceCategory(category, newCategory)
    }
}

/**
 * US-36: As a Platform Manager, I want to delete service 
 *        categories to remove services no longer provided 
 */
export class DeleteServiceCategoryController {
    private service: Service

    constructor() {
        this.service = new Service()
    }

    public async deleteServiceCategory(category: string): Promise<void> {
        await this.service.deleteServiceCategory(category)
    }
}

/**
 * US-37: As a Platform Manager, I want to search service categories so 
 *        that I can quickly find and manage specific types of services 
 */
export class SearchServiceCategoryController {
    private service: Service

    constructor() {
        this.service = new Service()
    }

    public async searchServiceCategory(category: string): Promise<string> {
        return await this.service.searchServiceCategory(category)
    }
}

/**
 * US-14: As a cleaner, I want to view my service 
 *        so that I can check on my services provided
 * 
 * Gets all the service 'types' provided by a cleaner (by their userID)
 */
export class ViewServicesProvidedController {
    private service: Service

    constructor() {
        this.service = new Service()
    }

    public async viewServicesProvided(
        userID: number,
        serviceName: string | null
    ): Promise<ServiceProvidedData[]> {
        return await this.service.viewServicesProvided(userID, serviceName)
    }
}

/**
 * Gets all the service 'types' provided by a cleaner (by their userID)
 */
export class ViewAllServicesProvidedController {
    private service: Service

    constructor() {
        this.service = new Service()
    }

    public async viewAllServicesProvided(
    ): Promise<AllServices[]> {
        return await this.service.viewAllServicesProvided()
    }
}

/**
 * US-13: As a cleaner, I want to create my service so 
 *        that homeowners can view my services provided 
 */
export class CreateServiceProvidedController {
    private service: Service

    constructor() {
        this.service = new Service()
    }

    public async createServiceProvided(
        cleanerID: number,
        serviceName: string,
        serviceCategory: string,
        description: string,
        price: number
    ): Promise<void> {
        await this.service.createServiceProvided(
            cleanerID,
            serviceName,
            serviceCategory,
            description,
            price
        )
    }
}
