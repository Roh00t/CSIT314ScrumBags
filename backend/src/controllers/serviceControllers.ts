import { Service } from "../entities/service"

export class ViewServicesController {
    private service: Service

    constructor() {
        this.service = new Service
    }

    public async viewServices(): Promise<string[]> {
        try {
            return await this.service.viewServices()
        } catch (err) {
            throw err
        }
    }
}

export class ViewServicesProvidedController {
    private service: Service

    constructor() {
        this.service = new Service()
    }

    public async viewServicesProvided(userID: number): Promise<string[]> {
        try {
            return await this.service.viewServicesProvided(userID)
        }
        catch (err) {
            throw err
        }
    }
}

export class CreateServiceProvidedController {
    private service: Service

    constructor() {
        this.service = new Service()
    }

    public async createServiceProvided(userID: number, newService: string): Promise<void> {
        try {
            await this.service.createServiceProvided(userID, newService)
        } catch (err) {
            throw err
        }
    }
}

export class CreateServiceController {
    private service: Service

    constructor() {
        this.service = new Service()
    }

    public async createService(service: string): Promise<void> {
        try {
            await this.service.createService(service)
        } catch (err) {
            throw err
        }
    }
}