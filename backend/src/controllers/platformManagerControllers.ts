import { ServiceBookingReportData } from '../shared/dataClasses'
import { ServiceBooking } from '../entities/serviceBooking'

/**
 * US-38: As a Platform Manager, I want to generate daily reports so 
 *        that I can view the daily statistics of cleaners and services
 */
export class GenerateDailyReportController {
    private serviceBooking: ServiceBooking

    constructor() {
        this.serviceBooking = new ServiceBooking()
    }

    public async generateDailyReport(
        startDate: Date
    ): Promise<ServiceBookingReportData[]> {
        return await this.serviceBooking.generateDailyReport(startDate)
    }
}

/**
 * US-39: As a Platform Manager, I want to generate weekly reports so 
 *        that I can view the weekly statistics of cleaners and services
 */
export class GenerateWeeklyReportController {
    private serviceBooking: ServiceBooking

    constructor() {
        this.serviceBooking = new ServiceBooking()
    }

    public async generateWeeklyReport(
        startDate: Date
    ): Promise<ServiceBookingReportData[]> {
        return await this.serviceBooking.generateWeeklyReport(startDate)
    }
}

/**
 * US-40: As a Platform Manager, I want to generate monthly reports so 
 *        that I can view the monthly statistics of cleaners and services
 */
export class GenerateMonthlyReportController {
    private serviceBooking: ServiceBooking

    constructor() {
        this.serviceBooking = new ServiceBooking()
    }

    public async generateMonthlyReport(
        startDate: Date
    ): Promise<ServiceBookingReportData[]> {
        return await this.serviceBooking.generateMonthlyReport(startDate)
    }
}
