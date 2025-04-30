import { CleanerServicesData, CleanerServiceBookingData } from '../shared/dataClasses'
import UserAccount from '../entities/userAccount'
import { ServiceBooking } from '../entities/serviceBooking'

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
        return await this.serviceBooking.searchCleanerServiceHistory(cleanerID, service, startDate, endDate)
    }
}