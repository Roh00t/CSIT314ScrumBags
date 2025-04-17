import UserAccount from "../entities/userAccount"

export class AddToShortlistController {
    private shortlistedCleaner: UserAccount

    constructor() {
        this.shortlistedCleaner = new UserAccount()
    }

    public async addToShortlist(homeownerID: number): Promise<void> {
        await this.shortlistedCleaner.addToShortlist(homeownerID)
    }

}

export class ViewShortlistController {
    private userAccount: UserAccount

    constructor() {
        this.userAccount = new UserAccount()
    }


}