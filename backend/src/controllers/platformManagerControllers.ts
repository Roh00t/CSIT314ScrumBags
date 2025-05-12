import { ServiceBookingReportData } from '../shared/dataClasses'
import { ServiceCategory } from '../entities/serviceCategory'
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

/**
 * US-33: As a Platform Manager, I want to create service categories, 
 *        to display more services which fit the requirements of our customers
 */
export class CreateServiceCategoryController {
    private serviceCategory: ServiceCategory

    constructor() {
        this.serviceCategory = new ServiceCategory()
    }

    public async createServiceCategory(category: string): Promise<boolean> {
        return await this.serviceCategory.createServiceCategory(category)
    }
}

/**
 * US-34: As a Platform Manager, I want to view current service 
 *        categories to see the current services provided
 * 
 * View all service 'categories' that exist
 */
export class ViewServiceCategoriesController {
    private serviceCategory: ServiceCategory

    constructor() {
        this.serviceCategory = new ServiceCategory()
    }

    public async viewServiceCategories(): Promise<string[]> {
        return await this.serviceCategory.viewServiceCategories()
    }
}

/**
 * US-35: As a Platform Manager, I want to update service categories 
 *        so that I can keep the available services accurate and up to date
 */
export class UpdateServiceCategoryController {
    private serviceCategory: ServiceCategory

    constructor() {
        this.serviceCategory = new ServiceCategory()
    }

    public async updateServiceCategory(
        category: string,
        newCategory: string
    ): Promise<boolean> {
        return await this.serviceCategory.updateServiceCategory(category, newCategory)
    }
}

/**
 * US-36: As a Platform Manager, I want to delete service 
 *        categories to remove services no longer provided 
 */
export class DeleteServiceCategoryController {
    private serviceCategory: ServiceCategory

    constructor() {
        this.serviceCategory = new ServiceCategory()
    }

    public async deleteServiceCategory(category: string): Promise<boolean> {
        return await this.serviceCategory.deleteServiceCategory(category)
    }
}

/**
 * US-37: As a Platform Manager, I want to search service categories so 
 *        that I can quickly find and manage specific types of services 
 */
export class SearchServiceCategoryController {
    private serviceCategory: ServiceCategory

    constructor() {
        this.serviceCategory = new ServiceCategory()
    }

    public async searchServiceCategory(category: string): Promise<string> {
        return await this.serviceCategory.searchServiceCategory(category)
    }
}