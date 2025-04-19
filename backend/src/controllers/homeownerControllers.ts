import UserAccount from "../entities/userAccount";
import { Service } from "../entities/service";
import { Serializer } from "v8";

export class AddToShortlistController {
    private userAccount: UserAccount

    constructor() {
        this.userAccount = new UserAccount()
    }

    public async addToShortlist(
        homeownerID: number, 
        cleanerID: number
    ): Promise<void>{
        // try {
        //     console.log(homeownerID, cleanerID)
        //     await this.userAccount.addToShortlist(homeownerID, cleanerID)
        //     console.log("Shortlist successful")
        // } catch (error) {
        //     console.log("Shortlist failed: ", error)
        //     throw error
        // }
        return await this.userAccount.addToShortlist(homeownerID, cleanerID)
    }
}

export class ViewShortListController {
    private userAccount: UserAccount

    constructor() {
        this.userAccount = new UserAccount()
    }

    public async viewShortlist(homeownerID: number): Promise<string[]> {
        try {
            return await this.userAccount.ViewShortlist(homeownerID)
        } catch(error) {
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
        service: string,
        date: Date
    ): Promise<string[]> {
        try {
            return await this.Service.viewServiceHistory(userID, service, date)
        } catch(error) {
            console.log("Failed to retrieve history: ", error)
            throw error
        }
    }
}