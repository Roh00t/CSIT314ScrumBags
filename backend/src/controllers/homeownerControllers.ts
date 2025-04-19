import UserAccount from "../entities/userAccount";

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
    private shortlistedCleaner: UserAccount

    constructor() {
        this.shortlistedCleaner = new UserAccount()
    }

    public async viewShortlist(homeownerID: number): Promise<string[]> {
        try {
            return await this.shortlistedCleaner.ViewShortlist(homeownerID)
        } catch(error) {
            console.log("Failed to retrieve shortlist: ", error)
            throw error
        }
    }
}