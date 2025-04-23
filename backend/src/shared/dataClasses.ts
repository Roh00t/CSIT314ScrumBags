import { BookingStatus } from "../db/schema/bookingStatusEnum"

export type UserAccountData = {
    id: number
    username: string
    userProfile: string
}

export type ServiceProvidedData = {
    serviceName: string
    description: string
    price: number
}

export type ServiceBookingReportData = {
    bookingid: number
    serviceName: string
    cleanerName: string
    price: number
    date: Date
}

export type ServiceData = {
    label: string
    category: string
}

export type CleanerServicesData = {
    cleaner: string
    service: string
    price: number
}

export type ServiceHistory = {
    cleanerName: string | null;
    serviceName: string | null;
    date: Date;
    price: string | null;
    status: BookingStatus;
};
