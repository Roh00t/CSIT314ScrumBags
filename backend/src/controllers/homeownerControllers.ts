import { ShortlistedServices } from "../entities/shortlistedService"
import { ServiceBooking } from "../entities/serviceBooking"
import { ServiceHistory } from "../shared/dataClasses"
import { BookingStatus } from "../db/schema/bookingStatusEnum"

/**
 * US-26: As a homeowner, I want to save the cleaners into my short list 
 *        so that I can have an easier time for future reference
 */
export class AddToShortlistController {
    private shortlistedCleaner: ShortlistedServices

    constructor() {
        this.shortlistedCleaner = new ShortlistedServices()
    }

    public async addToShortlist(
        homeownerID: number,
        cleanerID: number
    ): Promise<void> {
        return await this.shortlistedCleaner.addToShortlist(homeownerID, cleanerID)
    }
}

/**
 * US-28: As a homeowner, I want to view my shortlist so that I 
 *        can have an easy time looking for a cleaner or service
 */
export class ViewShortlistController {
    private shortlistedCleaner: ShortlistedServices

    constructor() {
        this.shortlistedCleaner = new ShortlistedServices()
    }

    public async viewShortlist(homeownerID: number): Promise<string[]> {
        return await this.shortlistedCleaner.viewShortlist(homeownerID)
    }
}

/**
 * US-27: As a homeowner, I want to search through my shortlist so that 
 *        I can find a specific cleaner or service I want
 */
export class SearchShortlistController {
    private shortlistedCleaner: ShortlistedServices

    constructor() {
        this.shortlistedCleaner = new ShortlistedServices()
    }

    public async searchShortlist(
        homeownerID: number,
        search: string
    ): Promise<string[]> {
        return await this.shortlistedCleaner.searchShortlist(homeownerID, search)
    }
}

/**
 * US-32: As a homeowner, I want to view the history of the 
 *        cleaner services used, filtered by services, date period 
 *        so that I can keep track of my previous expenses and bookings
 */
export class ViewHomeownerServiceHistoryController {
    private serviceBooking: ServiceBooking

    constructor() {
        this.serviceBooking = new ServiceBooking()
    }

    public async viewHomeownerServiceHistory(
        userID: number,
        service: string | null,
        fromDate: Date | string | null,
        toDate: Date | string | null
    ): Promise<ServiceHistory[]> {
        return await this.serviceBooking.viewHomeownerServiceHistory(
            userID, service, fromDate, toDate
        )
    }
}

/**
 * US-31: As a homeowner, I want to search the history of the cleaner 
 *        services used, filtered by services, date period so that I 
 *        can easily find past services for reference and rebooking
 */
export class SearchHomeownerServiceHistoryController {
    private serviceBooking: ServiceBooking

    constructor() {
        this.serviceBooking = new ServiceBooking()
    }

    public async searchHomeownerServiceHistory(
        userID: number,
        cleanerName: string,
        service: string | null,
        fromDate: Date | string | null,
        toDate: Date | string | null
    ): Promise<ServiceHistory[]> {
        return await this.serviceBooking.searchHomeownerServiceHistory(
            userID, cleanerName, service, fromDate, toDate
        )
    }
}

export class ViewAllServiceHistoryController {
    private serviceBooking: ServiceBooking

    constructor() {
        this.serviceBooking = new ServiceBooking()
    }

    public async viewAllServiceHistory(
        userID: number
    ): Promise<ServiceHistory[]> {
        return await this.serviceBooking.viewAllServiceHistory(userID)
    }
}

/**
 * US-443: As a homeowner, I want to book for cleaners so that cleaners can clean my home
 */
export class CreateServiceBookingController {
    private serviceBooking: ServiceBooking

    constructor() {
        this.serviceBooking = new ServiceBooking()
    }

    public async createServiceBooking(
        homeownerID: number,
        serviceProvidedID: number,
        startTimestamp: Date,
    ): Promise<void> {
        await this.serviceBooking.createServiceBooking(
            homeownerID, serviceProvidedID, startTimestamp
        )
    }
}