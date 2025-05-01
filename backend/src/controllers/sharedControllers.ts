import { UserAccountData } from "../shared/dataClasses"
import UserAccount from "../entities/userAccount"

/**
 * US-6:  As a user admin, I want to log in so that I can access my admin features
 * 
 * US-19: As a cleaner, I want to log in so that I can manage my services
 * 
 * US-29: As a homeowner, I want to log in so that I can manage my short list
 * 
 * US-41: As a Platform Manager, I want to log in to the 
 *        system so that I can manage platform operations
 */
export class LoginController {
    private userAccount: UserAccount

    constructor() {
        this.userAccount = new UserAccount()
    }

    /**
     * @param password The PLAINTEXT password (not encoded) 
     */
    public async login(
        username: string,
        password: string
    ): Promise<UserAccountData> {
        return await this.userAccount.login(username, password)
    }
}

