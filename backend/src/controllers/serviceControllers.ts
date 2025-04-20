import { ServiceData, ServiceProvidedData } from '../shared/dataClasses'
import { Service } from '../entities/service'

/**
 * Create new service 'categories'
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
 * Create new service, with a certain 'category' or 'type'
 */
export class CreateServiceController {
    private service: Service

    constructor() {
        this.service = new Service()
    }

    public async createService(
        serviceName: string,
        serviceCategory: string
    ): Promise<void> {
        await this.service.createService(serviceName, serviceCategory)
    }
}

/**
 * View all the services that exist, as well as their corresponding 'category'
 */
export class ViewServicesController {
    private service: Service

    constructor() {
        this.service = new Service()
    }

    public async viewServices(): Promise<ServiceData[]> {
        return await this.service.viewServices()
    }
}

/**
 * Gets all the service 'types' provided by a cleaner (by their userID)
 */
export class ViewServicesProvidedController {
    private service: Service

    constructor() {
        this.service = new Service()
    }

    public async viewServicesProvided(
        userID: number
    ): Promise<ServiceProvidedData[]> {
        return await this.service.viewServicesProvided(userID)
    }
}

/**
 * Cleaners can add the types of services they provide
 */
export class CreateServiceProvidedController {
    private service: Service

    constructor() {
        this.service = new Service()
    }

    public async createServiceProvided(
        userID: number,
        serviceName: string,
        description: string,
        price: number
    ): Promise<void> {
        await this.service.createServiceProvided(
            userID,
            serviceName,
            description,
            price
        )
    }
}
