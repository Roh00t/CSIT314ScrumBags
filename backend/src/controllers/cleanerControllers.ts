import { ServiceProvided } from '../entities/serviceProvided'
import { ServiceBooking } from '../entities/serviceBooking'
import UserAccount from '../entities/userAccount'
import {
    AllServices,
    CleanerServiceBookingData,
    CleanerServicesData,
    ServiceProvidedData
} from '../shared/dataClasses'

/**
 * US-25: As a homeowner, I want to view cleaners 
 *        so that I can see their services provided
 */
export class ViewCleanersController {
    private userAccount: UserAccount

    constructor() {
        this.userAccount = new UserAccount()
    }

    public async viewCleaners(
        cleanerName: string | null
    ): Promise<CleanerServicesData[]> {
        return await this.userAccount.viewCleaners(cleanerName)
    }
}

/**
 * US-23: As a cleaner, I want to view the history of my 
 *        confirmed services, filtered by services, date period 
 *        so that I can track my work and manage my schedule
 */
export class ViewCleanerServiceHistoryController {
    private serviceBooking: ServiceBooking

    constructor() {
        this.serviceBooking = new ServiceBooking()
    }

    public async viewCleanerServiceHistory(
        cleanerID: number,
        startDate: Date | null,
        endDate: Date | null
    ): Promise<CleanerServiceBookingData[]> {
        return await this.serviceBooking.viewCleanerServiceHistory(
            cleanerID, startDate, endDate
        )
    }
}

/**
 * US-22: As a cleaner, I want to search the history of my confirmed services, 
 *        filtered by services, date period, so that I can easily find past jobs
 */
export class SearchCleanerServiceHistoryController {
    private serviceBooking: ServiceBooking

    constructor() {
        this.serviceBooking = new ServiceBooking()
    }

    public async searchCleanerServiceHistory(
        cleanerID: number,
        service: string,
        startDate: Date | null,
        endDate: Date | null
    ): Promise<CleanerServiceBookingData[]> {
        return await this.serviceBooking.searchCleanerServiceHistory(
            cleanerID, service, startDate, endDate
        )
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