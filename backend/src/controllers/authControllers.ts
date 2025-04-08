import UserAccount from "../entities/userAccount"

export class LoginController {
    userAccount: UserAccount 

    constructor() {
        this.userAccount = new UserAccount()
    }

    public async login(username: string, password: string): Promise<boolean> {
        return true
    }
}