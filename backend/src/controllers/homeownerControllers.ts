import UserAccount from "../entities/userAccount";
import { Service } from "../entities/service";
import { Serializer } from "v8";
import { ServiceHistory } from "../shared/dataClasses";

export class AddToShortlistController {
    private userAccount: UserAccount

    constructor() {
        this.userAccount = new UserAccount()
    }

    public async addToShortlist(
        homeownerID: number,
        cleanerID: number
    ): Promise<void> {
        try {
            return await this.userAccount.addToShortlist(homeownerID, cleanerID)
        } catch (error) {
            console.log("Failed to add to shortlist: ", error)
            throw(error)
        }
    }
}

export class ViewShortListController {
    private userAccount: UserAccount

    constructor() {
        this.userAccount = new UserAccount()
    }

    public async viewShortlist(homeownerID: number): Promise<string[]> {
        try {
            return await this.userAccount.viewShortlist(homeownerID)
        } catch (error) {
            console.log("Failed to retrieve shortlist: ", error)
            throw error
        }
    }
}

export class ViewServiceHistoryController {
    private Service: Service

    constructor() {
        this.Service = new Service()
    }

    public async viewServiceHistory(
        userID: number,
        cleanerName: string | null,
        service: string,
        date: Date
    ): Promise<ServiceHistory[]> {
        try {
            return await this.Service.viewServiceHistory(userID, cleanerName, service, date)
        } catch (error) {
            console.log("Failed to retrieve history: ", error)
            throw error
        }
    }
}

export class ViewAllServiceHistoryController {
    private Service: Service

    constructor() {
        this.Service = new Service()
    }

    public async viewAllServiceHistory(
        userID: number
    ): Promise<ServiceHistory[]> {
        try {
            return await this.Service.viewAllServiceHistory(userID)
        } catch (error) {
            console.log("Failed to retrieve history: ", error)
            throw error
        }
    }
}