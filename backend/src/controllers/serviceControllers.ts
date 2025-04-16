import { ServiceProvided } from '../shared/dataClasses'
import { Service } from '../entities/service'

/**
 * Create new service 'category' or 'type'
 */
export class CreateServiceController {
    private service: Service

    constructor() {
        this.service = new Service()
    }

    public async createService(serviceName: string): Promise<void> {
        await this.service.createService(serviceName)
    }
}

/**
 * View all the services 'categories' or 'types' that exist
 */
export class ViewServicesController {
    private service: Service

    constructor() {
        this.service = new Service()
    }

    public async viewServices(): Promise<string[]> {
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
    ): Promise<ServiceProvided[]> {
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
