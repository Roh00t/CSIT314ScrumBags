import { Service } from "../entities/service"

export class ViewServicesController {
    private service: Service

    constructor() { this.service = new Service }

    public async viewServices(): Promise<string[]> {
        return await this.service.viewServices()
    }
}

export class ViewServicesProvidedController {
    private service: Service

    constructor() { this.service = new Service() }

    public async viewServicesProvided(userID: number): Promise<string[]> {
        return await this.service.viewServicesProvided(userID)
    }
}

export class CreateServiceProvidedController {
    private service: Service

    constructor() { this.service = new Service() }

    public async createServiceProvided(userID: number, newService: string): Promise<void> {
        await this.service.createServiceProvided(userID, newService)
    }
}

export class CreateServiceController {
    private service: Service

    constructor() { this.service = new Service() }

    public async createService(service: string): Promise<void> {
        await this.service.createService(service)
    }
}