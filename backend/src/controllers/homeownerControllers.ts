import { ServiceHistory } from "../shared/dataClasses"
import UserAccount from "../entities/userAccount"
import { Service } from "../entities/service"

/**
 * US-24: As a homeowner, I want to add cleaners to my shortlist 
 *        so that i can consider rebooking the cleaner
 */
export class AddToShortlistController {
    private userAccount: UserAccount

    constructor() {
        this.userAccount = new UserAccount()
    }

    public async addToShortlist(
        homeownerID: number,
        cleanerID: number
    ): Promise<void> {
        return await this.userAccount.addToShortlist(homeownerID, cleanerID)
    }
}

/**
 * US-28: As a homeowner, I want to view my shortlist so that I 
 *        can have an easy time looking for a cleaner or service
 */
export class ViewShortlistController {
    private userAccount: UserAccount

    constructor() {
        this.userAccount = new UserAccount()
    }

    public async viewShortlist(homeownerID: number): Promise<string[]> {
        return await this.userAccount.viewShortlist(homeownerID)
    }
}

/**
 * US-27: As a homeowner, I want to search through my shortlist so that 
 *        I can find a specific cleaner or service I want
 */
export class SearchShortlistController {
    private userAccount: UserAccount

    constructor() {
        this.userAccount = new UserAccount()
    }

    public async searchShortlist(
        homeownerID: number,
        search: string
    ): Promise<string[]> {
        return await this.userAccount.searchShortlist(homeownerID, search)
    }
}

/**
 * US-32: As a homeowner, I want to view the history of the 
 *        cleaner services used, filtered by services, date period 
 *        so that I can keep track of my previous expenses and bookings
 */
export class ViewServiceHistoryController {
    private service: Service

    constructor() {
        this.service = new Service()
    }

    public async viewServiceHistory(
        userID: number,
        cleanerName: string | null,
        service: string | null,
        fromDate: Date | string | null,
        toDate: Date | string | null
    ): Promise<ServiceHistory[]> {
        return await this.service.viewServiceHistory(
            userID, cleanerName, service, fromDate, toDate
        )
    }
}

export class ViewAllServiceHistoryController {
    private service: Service

    constructor() {
        this.service = new Service()
    }

    public async viewAllServiceHistory(
        userID: number
    ): Promise<ServiceHistory[]> {
        return await this.service.viewAllServiceHistory(userID)
    }
}