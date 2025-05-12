import { UserAccountData, UserProfileData } from '../shared/dataClasses'
import { UserProfile } from '../entities/userProfile'
import UserAccount from '../entities/userAccount'
import { GLOBALS } from '../shared/constants'
import bcrypt from 'bcrypt'

/**
 * US-1: As a user admin, I want to create a user account 
 *       so that new users can join the platform 
 */
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

/**
 * US-3: As a user admin, I want to update user accounts 
 *       so that I can keep user information accurate
 */
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
    ): Promise<boolean> {
        return await this.userAccount.updateUserAccount(
            userID,
            updateAs,
            updatedUsername,
            updatedPassword
        )
    }
}

/**
 * US-4: As a user admin, I want to suspend user accounts 
 *       so that I can restrict access when needed
 */
export class SuspendUserAccountController {
    private userAccount: UserAccount

    constructor() {
        this.userAccount = new UserAccount()
    }

    public async suspendUserAccount(userID: number): Promise<boolean> {
        return await this.userAccount.suspendUserAccount(userID)
    }

    // TODO: Remove this for submission (??)
    public async unsuspendUserAccount(userID: number) {
        await this.userAccount.unsuspendUserAccount(userID);
    }
}

/**
 * US-5: As a user admin, I want to search for user 
 *       accounts so that I can locate specific users
 */
export class SearchUserAccountController {
    private userAccount: UserAccount

    constructor() {
        this.userAccount = new UserAccount()
    }

    public async searchUserAccount(search: string): Promise<UserAccountData | null> {
        return await this.userAccount.searchUserAccount(search)
    }
}

/**
 * US-8: As a user admin, I want to create new user 
 *       profiles so that I can map them to user accounts
 */
export class CreateNewUserProfileController {
    private userProfile: UserProfile

    constructor() {
        this.userProfile = new UserProfile()
    }

    public async createNewUserProfile(profileName: string): Promise<boolean> {
        return await this.userProfile.createNewUserProfile(profileName)
    }
}

/**
 * US-9: As a user admin, I want to view user profiles 
 *       so that I can access profile information
 */
export class ViewUserProfilesController {
    private userProfile: UserProfile

    constructor() {
        this.userProfile = new UserProfile()
    }

    public async viewUserProfiles(): Promise<UserProfileData[]> {
        return await this.userProfile.viewUserProfiles()
    }
}

/**
 * US-10: As a user admin, I want to update user profiles 
 *        so that I can keep profile information up to date
 */
export class UpdateUserProfileController {
    private userProfile: UserProfile

    constructor() {
        this.userProfile = new UserProfile()
    }

    public async updateUserProfile(
        oldProfileName: string,
        newProfileName: string
    ): Promise<boolean> {
        return await this.userProfile.updateUserProfile(
            oldProfileName,
            newProfileName
        )
    }
}

/**
 * US-11: As a user admin, I want to suspend user profiles 
 *        so that I can restrict user access if necessary
 */
export class SuspendUserProfileController {
    private userProfile: UserProfile

    constructor() {
        this.userProfile = new UserProfile()
    }

    public async suspendUserProfile(profileName: string): Promise<boolean> {
        return await this.userProfile.suspendUserProfile(profileName)
    }

    public async unsuspendProfile(profileName: string): Promise<void> {
        await this.userProfile.unsuspendUserProfile(profileName)
    }
}

/**
 * US-12: As a user admin, I want to search for user profiles 
 *        so that I can find specific user profiles
 */
export class SearchUserProfileController {
    private userProfile: UserProfile

    constructor() {
        this.userProfile = new UserProfile()
    }

    public async searchUserProfiles(search: string): Promise<UserProfileData | null> {
        return await this.userProfile.searchUserProfile(search)
    }
}