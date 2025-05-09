import { serviceCategoriesTable } from '../db/schema/serviceCategories'
import { servicesProvidedTable } from '../db/schema/servicesProvided'
import { serviceBookingsTable } from '../db/schema/serviceBookings'
import { userAccountsTable } from '../db/schema/userAccounts'
import { and, eq, gt, gte, ilike, lt } from 'drizzle-orm'
import { DrizzleClient } from '../shared/constants'
import { drizzle } from 'drizzle-orm/node-postgres'
import {
    CleanerServiceBookingData,
    ServiceBookingReportData,
    ServiceHistory,
} from '../shared/dataClasses'

export class ServiceBooking {
    private db: DrizzleClient

    constructor() {
        this.db = drizzle(process.env.DATABASE_URL!)
    }

    /**
     * US-38: As a Platform Manager, I want to generate daily reports so 
     *        that I can view the daily statistics of cleaners and services
     */
    public async generateDailyReport(
        startDate: Date
    ): Promise<ServiceBookingReportData[]> {
        const startOfNextDay = new Date(startDate)
        startOfNextDay.setDate(startDate.getDate() + 1)

        const dailyReport = await this.db
            .select({
                bookingID: serviceBookingsTable.id,
                serviceName: serviceCategoriesTable.label,
                cleanerName: userAccountsTable.username,
                price: servicesProvidedTable.price,
                date: serviceBookingsTable.startTimestamp
            })
            .from(serviceBookingsTable)
            .leftJoin(
                servicesProvidedTable,
                eq(serviceBookingsTable.serviceProvidedID, servicesProvidedTable.id)
            )
            .leftJoin(
                serviceCategoriesTable,
                eq(servicesProvidedTable.serviceCategoryID, serviceCategoriesTable.id)
            )
            .leftJoin(
                userAccountsTable,
                eq(servicesProvidedTable.cleanerID, userAccountsTable.id)
            )
            .where(
                and(
                    gte(serviceBookingsTable.startTimestamp, startDate),
                    lt(serviceBookingsTable.startTimestamp, startOfNextDay)
                )
            )

        return dailyReport.map(dr => {
            return {
                bookingid: dr.bookingID,
                serviceName: dr.serviceName,
                cleanerName: dr.cleanerName,
                price: Number(dr.price),
                date: dr.date
            } as ServiceBookingReportData
        })
    }

    /**
     * US-39: As a Platform Manager, I want to generate weekly reports so 
     *        that I can view the weekly statistics of cleaners and services
     */
    public async generateWeeklyReport(
        startDate: Date
    ): Promise<ServiceBookingReportData[]> {
        const startOfNextWeek = new Date(startDate)
        startOfNextWeek.setDate(startOfNextWeek.getDate() + 7)

        const weeklyReport = await this.db
            .select({
                bookingID: serviceBookingsTable.id,
                serviceName: serviceCategoriesTable.label,
                cleanerName: userAccountsTable.username,
                price: servicesProvidedTable.price,
                date: serviceBookingsTable.startTimestamp
            })
            .from(serviceBookingsTable)
            .leftJoin(
                servicesProvidedTable,
                eq(serviceBookingsTable.serviceProvidedID, servicesProvidedTable.id)
            )
            .leftJoin(
                serviceCategoriesTable,
                eq(servicesProvidedTable.serviceCategoryID, serviceCategoriesTable.id)
            )
            .leftJoin(
                userAccountsTable,
                eq(servicesProvidedTable.cleanerID, userAccountsTable.id)
            )
            .where(
                and(
                    gte(serviceBookingsTable.startTimestamp, startDate),
                    lt(serviceBookingsTable.startTimestamp, startOfNextWeek)
                )
            )

        return weeklyReport.map(wr => {
            return {
                bookingid: wr.bookingID,
                serviceName: wr.serviceName,
                cleanerName: wr.cleanerName,
                price: Number(wr.price),
                date: wr.date
            } as ServiceBookingReportData
        })
    }

    /**
     * US-40: As a Platform Manager, I want to generate monthly reports so 
     *        that I can view the monthly statistics of cleaners and services
     */
    public async generateMonthlyReport(
        startDate: Date
    ): Promise<ServiceBookingReportData[]> {
        const date = new Date(startDate)
        const nextMonth = new Date(date.setMonth(startDate.getMonth() + 1))

        const monthlyReport = await this.db
            .select({
                bookingID: serviceBookingsTable.id,
                serviceName: serviceCategoriesTable.label,
                cleanerName: userAccountsTable.username,
                price: servicesProvidedTable.price,
                date: serviceBookingsTable.startTimestamp
            })
            .from(serviceBookingsTable)
            .leftJoin(
                servicesProvidedTable,
                eq(serviceBookingsTable.serviceProvidedID, servicesProvidedTable.id)
            )
            .leftJoin(
                serviceCategoriesTable,
                eq(servicesProvidedTable.serviceCategoryID, serviceCategoriesTable.id)
            )
            .leftJoin(
                userAccountsTable,
                eq(servicesProvidedTable.cleanerID, userAccountsTable.id)
            )
            .where(
                and(
                    gte(serviceBookingsTable.startTimestamp, startDate),
                    lt(
                        serviceBookingsTable.startTimestamp,
                        nextMonth
                    )
                )
            )
        return monthlyReport.map(mr => {
            return {
                bookingid: mr.bookingID,
                serviceName: mr.serviceName,
                cleanerName: mr.cleanerName,
                price: Number(mr.price),
                date: mr.date
            } as ServiceBookingReportData
        })
    }

    /**
     * US-23: As a cleaner, I want to view the history of my 
     *        confirmed services, filtered by services, date period 
     *        so that I can track my work and manage my schedule
     */
    public async viewCleanerServiceHistory(
        cleanerID: number,
        startDate: Date | null,
        endDate: Date | null
    ): Promise<CleanerServiceBookingData[]> {

        const conditions = [
            eq(servicesProvidedTable.cleanerID, cleanerID),
        ]

        if (startDate && endDate) {
            conditions.push(gte(serviceBookingsTable.startTimestamp, startDate))
            conditions.push(lt(serviceBookingsTable.startTimestamp, endDate))
        }

        const queryResult = await this.db.select()
            .from(serviceBookingsTable)
            .leftJoin(
                servicesProvidedTable,
                eq(serviceBookingsTable.serviceProvidedID, servicesProvidedTable.id)
            )
            .leftJoin(
                userAccountsTable,
                eq(serviceBookingsTable.homeownerID, userAccountsTable.id)
            )
            .leftJoin(
                serviceCategoriesTable,
                eq(servicesProvidedTable.serviceCategoryID, serviceCategoriesTable.id)
            )
            .where(and(...conditions))

        return queryResult.map(qr => {
            return {
                bookingid: qr.service_bookings.id,
                status: qr.service_bookings.status,
                serviceName: qr.services_provided?.serviceName,
                date: qr.service_bookings.startTimestamp,
                homeOwnerName: qr.user_accounts?.username
            } as CleanerServiceBookingData
        })
    }

    /**
     * US-22: As a cleaner, I want to search the history of my confirmed services, 
     *        filtered by services, date period, so that I can easily find past jobs
     */
    public async searchCleanerServiceHistory(
        cleanerID: number,
        service: string,
        startDate: Date | null,
        endDate: Date | null
    ): Promise<CleanerServiceBookingData[]> {
        const conditions = [
            eq(servicesProvidedTable.cleanerID, cleanerID),
            ilike(servicesProvidedTable.serviceName, `%${service}%`)
        ]

        if (startDate && endDate) {
            conditions.push(gte(serviceBookingsTable.startTimestamp, startDate))
            conditions.push(lt(serviceBookingsTable.startTimestamp, endDate))
        }

        const queryResult = await this.db.select()
            .from(serviceBookingsTable)
            .leftJoin(
                servicesProvidedTable,
                eq(serviceBookingsTable.serviceProvidedID, servicesProvidedTable.id)
            )
            .leftJoin(
                userAccountsTable,
                eq(serviceBookingsTable.homeownerID, userAccountsTable.id)
            )
            .leftJoin(
                serviceCategoriesTable,
                eq(servicesProvidedTable.serviceCategoryID, serviceCategoriesTable.id)
            )
            .where(and(...conditions))

        return queryResult.map(qr => {
            return {
                bookingid: qr.service_bookings.id,
                status: qr.service_bookings.status,
                serviceName: qr.services_provided?.serviceName,
                date: qr.service_bookings.startTimestamp,
                homeOwnerName: qr.user_accounts?.username
            } as CleanerServiceBookingData
        })
    }

    public async viewAllServiceHistory(
        userID: number
    ): Promise<ServiceHistory[]> {
        const results = await this.db
            .select({
                cleanerName: userAccountsTable.username,
                serviceName: servicesProvidedTable.serviceName,
                date: serviceBookingsTable.startTimestamp,
                price: servicesProvidedTable.price,
                status: serviceBookingsTable.status
            })
            .from(serviceBookingsTable)
            .leftJoin(
                servicesProvidedTable,
                eq(serviceBookingsTable.serviceProvidedID, servicesProvidedTable.id)
            )
            .leftJoin(
                userAccountsTable,
                eq(servicesProvidedTable.cleanerID, userAccountsTable.id)
            )
            .where(eq(serviceBookingsTable.homeownerID, userID))

        return results.map(res => {
            return {
                cleanerName: res.cleanerName,
                serviceName: res.serviceName,
                date: res.date,
                price: res.price,
                status: res.status
            } as ServiceHistory
        })
    }

    /**
     * US-32: As a homeowner, I want to view the history of the 
     *        cleaner services used, filtered by services, date period 
     *        so that I can keep track of my previous expenses and bookings
     * 
     * View & Search (by username) Service History filtered by service and date 
     */
    public async viewHomeownerServiceHistory(
        userID: number,
        service: string | null,
        fromDate: Date | string | null,
        toDate: Date | string | null
    ): Promise<ServiceHistory[]> {

        const conditions = [
            eq(serviceBookingsTable.homeownerID, userID),
        ];

        if (service) {
            conditions.push(eq(servicesProvidedTable.serviceName, service));
        }

        if (fromDate) {
            const normalizedFromDate = typeof fromDate === 'string' ? new Date(fromDate) : fromDate;
            const startOfFromDay = new Date(normalizedFromDate.setHours(0, 0, 0, 0));

            conditions.push(
                gt(serviceBookingsTable.startTimestamp, startOfFromDay)
            );
        }

        if (toDate) {
            const normalizedToDate = typeof toDate === 'string' ? new Date(toDate) : toDate;
            const startOfToDay = new Date(normalizedToDate.setHours(0, 0, 0, 0));
            const endOfToDay = new Date(startOfToDay);
            endOfToDay.setDate(endOfToDay.getDate() + 1);

            conditions.push(
                lt(serviceBookingsTable.startTimestamp, endOfToDay)
            );
        }

        const results = await this.db
            .select({
                cleanerName: userAccountsTable.username,
                serviceName: servicesProvidedTable.serviceName,
                date: serviceBookingsTable.startTimestamp,
                price: servicesProvidedTable.price,
                status: serviceBookingsTable.status
            })
            .from(serviceBookingsTable)
            .leftJoin(
                servicesProvidedTable,
                eq(serviceBookingsTable.serviceProvidedID, servicesProvidedTable.id)
            )
            .leftJoin(
                userAccountsTable,
                eq(servicesProvidedTable.cleanerID, userAccountsTable.id)
            )
            .where(and(...conditions));

        if (results.length === 0) {
            throw new Error("No service history found for the given criteria.");
        }

        return results.map(res => ({
            cleanerName: res.cleanerName,
            serviceName: res.serviceName,
            date: new Date(res.date),
            price: res.price,
            status: res.status
        }));
    }

    /**
     * US-31: As a homeowner, I want to search the history of the cleaner 
     *        services used, filtered by services, date period so that I 
     *        can easily find past services for reference and rebooking
     */
    public async searchHomeownerServiceHistory(
        userID: number,
        cleanerName: string | null,
        service: string | null,
        fromDate: Date | string | null,
        toDate: Date | string | null
    ): Promise<ServiceHistory[]> {

        const conditions = [
            eq(serviceBookingsTable.homeownerID, userID),
        ];

        if (service) {
            conditions.push(eq(servicesProvidedTable.serviceName, service));
        }

        if (fromDate) {
            const normalizedFromDate = typeof fromDate === 'string' ? new Date(fromDate) : fromDate;
            const startOfFromDay = new Date(normalizedFromDate.setHours(0, 0, 0, 0));

            conditions.push(
                gt(serviceBookingsTable.startTimestamp, startOfFromDay)
            );
        }

        if (toDate) {
            const normalizedToDate = typeof toDate === 'string' ? new Date(toDate) : toDate;
            const startOfToDay = new Date(normalizedToDate.setHours(0, 0, 0, 0));
            const endOfToDay = new Date(startOfToDay);
            endOfToDay.setDate(endOfToDay.getDate() + 1);

            conditions.push(
                lt(serviceBookingsTable.startTimestamp, endOfToDay)
            );
        }

        if (cleanerName) {
            conditions.push(eq(userAccountsTable.username, cleanerName));
        }

        const results = await this.db
            .select({
                cleanerName: userAccountsTable.username,
                serviceName: servicesProvidedTable.serviceName,
                date: serviceBookingsTable.startTimestamp,
                price: servicesProvidedTable.price,
                status: serviceBookingsTable.status
            })
            .from(serviceBookingsTable)
            .leftJoin(
                servicesProvidedTable,
                eq(serviceBookingsTable.serviceProvidedID, servicesProvidedTable.id)
            )
            .leftJoin(
                userAccountsTable,
                eq(servicesProvidedTable.cleanerID, userAccountsTable.id)
            )
            .where(and(...conditions));

        // Handle no results
        if (results.length === 0) {
            throw new Error("No service history found for the given criteria.");
        }

        // Map and return results
        return results.map(res => ({
            cleanerName: res.cleanerName,
            serviceName: res.serviceName,
            date: new Date(res.date),
            price: res.price,
            status: res.status
        }));
    }

    /**
     * US-443: As a homeowner, I want to book for 
     *         cleaners so that cleaners can clean my home
     */
    public async createServiceBooking(
        homeownerID: number,
        serviceProvidedID: number,
        startTimestamp: Date,
    ): Promise<void> {
        await this.db
            .insert(serviceBookingsTable)
            .values({
                homeownerID: homeownerID,
                serviceProvidedID: serviceProvidedID,
                startTimestamp: startTimestamp,
            })
    }
}

