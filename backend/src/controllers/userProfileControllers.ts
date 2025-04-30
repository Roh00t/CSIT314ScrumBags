import { UserProfilesSelect } from '../db/schema/userProfiles'
import { UserProfile } from '../entities/userProfile'

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

    public async viewUserProfiles(): Promise<{ name: string, isSuspended: boolean }[]> {
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
    ): Promise<void> {
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

    public async suspendUserProfile(profileName: string): Promise<void> {
        await this.userProfile.suspendUserProfile(profileName)
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

    public async searchUserProfiles(search: string): Promise<UserProfilesSelect> {
        return await this.userProfile.searchUserProfile(search)
    }
}