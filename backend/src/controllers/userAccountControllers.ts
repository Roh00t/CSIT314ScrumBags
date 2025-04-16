import { UserAccountResponse } from '../shared/dataClasses'
import UserAccount from '../entities/userAccount'
import { GLOBALS } from '../shared/constants'
import bcrypt from 'bcrypt'

export class ViewUserAccountsController {
    private userAccount: UserAccount

    constructor() {
        this.userAccount = new UserAccount()
    }

    public async viewUserAccounts(): Promise<UserAccountResponse[]> {
        return await this.userAccount.viewUserAccounts()
    }
}

export class LoginController {
    private userAccount: UserAccount

    constructor() {
        this.userAccount = new UserAccount()
    }

    public async login(
        username: string,
        password: string
    ): Promise<UserAccountResponse> {
        return await this.userAccount.login(username, password)
    }
}

export class CreateNewUserAccountController {
    private userAccount: UserAccount

    constructor() {
        this.userAccount = new UserAccount()
    }

    /**
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
