import UserAccount from '../entities/userAccount'
import { CleanerServicesData } from '../shared/dataClasses'

export class ViewCleanersController {
    private userAccount: UserAccount

    constructor() {
        this.userAccount = new UserAccount()
    }

    public async viewCleaners(): Promise<CleanerServicesData[]> {
        return await this.userAccount.viewCleaners()
    }
}
