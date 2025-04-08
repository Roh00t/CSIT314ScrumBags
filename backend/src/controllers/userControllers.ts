import UserAccount from "../entities/userAccount"

export class CreateNewUserAccountController {
    userAccount: UserAccount

    constructor() {
        this.userAccount = new UserAccount()
    }

    public async createNewUserAccount(
        createAs: string,
        username: string,
        password: string
    ): Promise<boolean> {

        return await this.userAccount.createNewUserAccount(
            createAs,
            username,
            password
        )
    }
}