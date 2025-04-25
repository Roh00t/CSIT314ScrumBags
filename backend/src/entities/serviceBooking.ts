import { serviceCategoriesTable } from '../db/schema/serviceCategories'
import { servicesProvidedTable } from '../db/schema/servicesProvided'
import { serviceBookingsTable } from '../db/schema/serviceBookings'
import { ServiceBookingReportData } from '../shared/dataClasses'
import { userAccountsTable } from '../db/schema/userAccounts'
import { DrizzleClient } from '../shared/constants'
import { drizzle } from 'drizzle-orm/node-postgres'
import { and, eq, gte, lt } from 'drizzle-orm'

export class ServiceBooking {
    private db: DrizzleClient

    constructor() {
        this.db = drizzle(process.env.DATABASE_URL!)
    }

    public async generateDailyReport(
        startDate: Date
    ): Promise<ServiceBookingReportData[]> {
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
                    lt(
                        serviceBookingsTable.startTimestamp,
                        new Date(startDate.getTime() + 24 * 60 * 60 * 1000)
                    )
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

    public async generateWeeklyReport(
        startDate: Date
    ): Promise<ServiceBookingReportData[]> {
        const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24

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
                    lt(
                        serviceBookingsTable.startTimestamp,
                        new Date(startDate.getTime() + (MILLISECONDS_PER_DAY * 7))
                    )
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
}
