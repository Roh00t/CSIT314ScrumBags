import { pgEnum } from 'drizzle-orm/pg-core'

export enum BookingStatus {
    Requested = 'requested',
    Accepted = 'accepted',
    Rejected = 'rejected',
    Pending = 'pending',
    Cancelled = 'cancelled',
    Done = 'done'
}

export const bookingStatusEnum = pgEnum('booking_status', [
    BookingStatus.Requested,
    BookingStatus.Accepted,
    BookingStatus.Rejected,
    BookingStatus.Pending,
    BookingStatus.Cancelled,
    BookingStatus.Done
])
