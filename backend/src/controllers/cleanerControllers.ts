import { CleanerServicesData, CleanerServiceBookingData } from '../shared/dataClasses'
import UserAccount from '../entities/userAccount'
import { ServiceBooking } from '../entities/serviceBooking'

export class ViewCleanersController {
    private userAccount: UserAccount

    constructor() {
        this.userAccount = new UserAccount()
    }

    public async viewCleaners(): Promise<CleanerServicesData[]> {
        return await this.userAccount.viewCleaners()
    }
}
export class ViewCleanerServiceHistoryController {
    private serviceBooking : ServiceBooking

    constructor() {
        this.serviceBooking = new ServiceBooking()
    }

    public async viewCleanerServiceHistory(
        cleanerID: number,
        service: string | null,
        startDate: Date  | null,
        endDate: Date | null
    ): Promise<CleanerServiceBookingData[]>{
        return await this.serviceBooking.viewCleanerServiceHistory(cleanerID, service, startDate, endDate)
    }
}