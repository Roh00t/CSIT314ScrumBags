import UserAccount from "../entities/userAccount";



export class ViewCleanersController {
    private userAccount: UserAccount

    constructor () {this.userAccount = new UserAccount()}

    public async viewCleaners(): Promise<string[]> {
        return await this.userAccount.viewCleaners() 
    }
}