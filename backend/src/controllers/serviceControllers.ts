import { AllServices, ServiceProvidedData } from '../shared/dataClasses'
import { ServiceProvided } from '../entities/serviceProvided'
import { ServiceCategory } from '../entities/serviceCategory'

/**
 * US-33: As a Platform Manager, I want to create service categories, 
 *        to display more services which fit the requirements of our customers
 */
export class CreateServiceCategoryController {
    private serviceCategory: ServiceCategory

    constructor() {
        this.serviceCategory = new ServiceCategory()
    }

    public async createServiceCategory(categoryLabel: string): Promise<void> {
        return await this.serviceCategory.createServiceCategory(categoryLabel)
    }
}

/**
 * US-34: As a Platform Manager, I want to view current service 
 *        categories to see the current services provided
 * 
 * View all service 'categories' that exist
 */
export class ViewServiceCategoriesController {
    private serviceCategory: ServiceCategory

    constructor() {
        this.serviceCategory = new ServiceCategory()
    }

    public async viewServiceCategories(): Promise<string[]> {
        return await this.serviceCategory.viewServiceCategories()
    }
}

/**
 * US-35: As a Platform Manager, I want to update service categories 
 *        so that I can keep the available services accurate and up to date
 */
export class UpdateServiceCategoryController {
    private serviceCategory: ServiceCategory

    constructor() {
        this.serviceCategory = new ServiceCategory()
    }

    public async updateServiceCategory(
        category: string,
        newCategory: string
    ): Promise<void> {
        await this.serviceCategory.updateServiceCategory(category, newCategory)
    }
}

/**
 * US-36: As a Platform Manager, I want to delete service 
 *        categories to remove services no longer provided 
 */
export class DeleteServiceCategoryController {
    private serviceCategory: ServiceCategory

    constructor() {
        this.serviceCategory = new ServiceCategory()
    }

    public async deleteServiceCategory(category: string): Promise<void> {
        await this.serviceCategory.deleteServiceCategory(category)
    }
}

/**
 * US-37: As a Platform Manager, I want to search service categories so 
 *        that I can quickly find and manage specific types of services 
 */
export class SearchServiceCategoryController {
    private serviceCategory: ServiceCategory

    constructor() {
        this.serviceCategory = new ServiceCategory()
    }

    public async searchServiceCategory(category: string): Promise<string> {
        return await this.serviceCategory.searchServiceCategory(category)
    }
}

/**
 * US-14: As a cleaner, I want to view my service 
 *        so that I can check on my services provided
 * 
 * Gets all the service 'types' provided by a cleaner (by their userID)
 */
export class ViewServicesProvidedController {
    private serviceProvided: ServiceProvided

    constructor() {
        this.serviceProvided = new ServiceProvided()
    }

    public async viewServicesProvided(
        userID: number,
        serviceName: string | null
    ): Promise<ServiceProvidedData[]> {
        return await this.serviceProvided.viewServicesProvided(userID, serviceName)
    }
}

/**
 * Gets all the service 'types' provided by a cleaner (by their userID)
 */
export class ViewAllServicesProvidedController {
    private serviceProvided: ServiceProvided

    constructor() {
        this.serviceProvided = new ServiceProvided()
    }

    public async viewAllServicesProvided(
    ): Promise<AllServices[]> {
        return await this.serviceProvided.viewAllServicesProvided()
    }
}

/**
 * US-13: As a cleaner, I want to create my service so 
 *        that homeowners can view my services provided 
 */
export class CreateServiceProvidedController {
    private serviceProvided: ServiceProvided

    constructor() {
        this.serviceProvided = new ServiceProvided()
    }

    public async createServiceProvided(
        cleanerID: number,
        serviceName: string,
        serviceCategory: string,
        description: string,
        price: number
    ): Promise<void> {
        await this.serviceProvided.createServiceProvided(
            cleanerID,
            serviceName,
            serviceCategory,
            description,
            price
        )
    }
}
