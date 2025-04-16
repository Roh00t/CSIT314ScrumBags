export type UserAccountResponse = {
    id: number
    username: string
    userProfile: string
}

export type ServiceProvided = {
    serviceName: string,
    description: string,
    price: number
}

export type ServiceBookingReportDatum = {
    // ID , Services, Cleaner Name, Price, Date
    bookingid : number,
    serviceName : string,
    cleanerName: string,
    price: number,
    date: Date
}