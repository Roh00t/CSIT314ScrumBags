import { ServiceBookingReportDatum } from '../shared/dataClasses'
import { ServiceBooking } from '../entities/platformManagerReport'

export class GenerateReportController {
    private serviceBooking: ServiceBooking
    constructor() {
        this.serviceBooking = new ServiceBooking()
    }

    public async generateDailyReport(
        myDate: Date
    ): Promise<ServiceBookingReportDatum[]> {
        return await this.serviceBooking.generateDailyReport(myDate)
    }
}
