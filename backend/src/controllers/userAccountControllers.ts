import { UserAccountData } from '../shared/dataClasses'
import UserAccount from '../entities/userAccount'
import { GLOBALS } from '../shared/constants'
import bcrypt from 'bcrypt'

/**
 * US-6: As a user admin, I want to log in so that I can access my admin features
 * US-18: As a cleaner, I want to log in so that I can manage my services
 * US-19: As a homeowner, I want to log in so that I can manage my short list
 * US-41: As a Platform Manager, I want to log in to the 
 *        system so that I can manage platform operations
 */
export class LoginController {
    private userAccount: UserAccount

    constructor() {
        this.userAccount = new UserAccount()
    }

    public async login(
        username: string,
        password: string
    ): Promise<UserAccountData> {
        return await this.userAccount.login(username, password)
    }
}

/**
 * US-1 
 */
export class CreateNewUserAccountController {
    private userAccount: UserAccount

    constructor() {
        this.userAccount = new UserAccount()
    }

    /**
     * 
     * US-1: As a user admin, I want to create a user 
     *       account so that new users can join the platform
     * 
     * @param password The PLAINTEXT password (not encoded)
     */
    public async createNewUserAccount(
        createAs: string,
        username: string,
        password: string
    ): Promise<boolean> {
        const hashedPassword = await bcrypt.hash(password, GLOBALS.SALT_ROUNDS)
        return await this.userAccount.createNewUserAccount(
            createAs,
            username,
            hashedPassword
        )
    }
}

/**
 * US-2: As a user admin, I want to view user accounts so that I can see user information
 */
export class ViewUserAccountsController {
    private userAccount: UserAccount

    constructor() {
        this.userAccount = new UserAccount()
    }

    public async viewUserAccounts(): Promise<UserAccountData[]> {
        return await this.userAccount.viewUserAccounts()
    }
}

export class UpdateUserAccountController {
    private userAccount: UserAccount

    constructor() {
        this.userAccount = new UserAccount()
    }

    public async updateUserAccount(
        userID: number,
        updateAs: string,
        updatedUsername: string,
        updatedPassword: string
    ): Promise<void> {
        return await this.userAccount.updateUserAccount(
            userID,
            updateAs,
            updatedUsername,
            updatedPassword
        )
    }
}

export class SuspendUserAccountController {
    private userAccount: UserAccount

    constructor() {
        this.userAccount = new UserAccount()
    }

    public async suspendUserAccount(userID: number) {
        await this.userAccount.suspendUserAccount(userID)
    }
    public async unsuspendUserAccount(userID: number) {
        await this.userAccount.unsuspendUserAccount(userID);
    }
}

export class SearchUserAccountController {
    private userAccount: UserAccount

    constructor() {
        this.userAccount = new UserAccount()
    }

    public async searchUserAccount(search: string): Promise<UserAccountData> {
        return await this.userAccount.searchUserAccount(search)
    }
}