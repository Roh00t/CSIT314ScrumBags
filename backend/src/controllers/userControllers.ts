import { UserAccountResponse } from "../dto/userDTOs"
import UserAccount from "../entities/userAccount"
import { GLOBALS } from "../misc/constants"
import bcrypt from 'bcrypt'

export class LoginController {
    private userAccount: UserAccount

    constructor() {
        this.userAccount = new UserAccount()
    }

    public async login(username: string, password: string): Promise<UserAccountResponse> {
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
        const salt = await bcrypt.genSalt(GLOBALS.SALT_ROUNDS)
        const hashedPassword = await bcrypt.hash(password, salt)

        return await this.userAccount.createNewUserAccount(
            createAs,
            username,
            hashedPassword
        )
    }
}