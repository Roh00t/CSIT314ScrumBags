import { drizzle } from 'drizzle-orm/node-postgres'
import { DrizzleClient } from '../shared/constants'
import { ServiceBookingReportDatum } from '../shared/dataClasses'
import { serviceBookingsTable } from '../db/schema/serviceBookings'
import { servicesTable } from '../db/schema/services'
import { and, eq, gte, lt } from 'drizzle-orm'
import { userAccountsTable } from '../db/schema/userAccounts'
import { servicesProvidedTable } from '../db/schema/servicesProvided'

export class ServiceBooking {
    private db: DrizzleClient

    constructor() {
        this.db = drizzle(process.env.DATABASE_URL!)
    }

    public async generateDailyReport(
        myDate: Date
    ): Promise<ServiceBookingReportDatum[]> {
        const dailyreport = await this.db
            .select({
                bookingID: serviceBookingsTable.serviceID,
                serviceName: servicesTable.label,
                cleanerName: userAccountsTable.username,
                price: servicesProvidedTable.price,
                date: serviceBookingsTable.startTimestamp
            })
            .from(serviceBookingsTable)
            .leftJoin(
                servicesTable,
                eq(serviceBookingsTable.serviceID, servicesTable.id)
            )
            .leftJoin(
                userAccountsTable,
                eq(serviceBookingsTable.cleanerID, userAccountsTable.id)
            )
            .leftJoin(
                servicesProvidedTable,
                eq(
                    serviceBookingsTable.cleanerID,
                    servicesProvidedTable.cleanerID
                )
            )
            .where(
                and(
                    gte(serviceBookingsTable.startTimestamp, myDate),
                    lt(
                        serviceBookingsTable.startTimestamp,
                        new Date(myDate.getDate() + 1)
                    )
                )
            )

        const dailyReportMapped = dailyreport.map((dr) => {
            return {
                bookingid: dr.bookingID,
                serviceName: dr.serviceName,
                cleanerName: dr.cleanerName,
                price: Number(dr.price),
                date: dr.date
            } as ServiceBookingReportDatum
        })
        return dailyReportMapped
    }
}
