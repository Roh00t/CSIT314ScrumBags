import { UserProfile } from '../entities/userProfile'

export class CreateNewUserProfileController {
    private userProfile: UserProfile

    constructor() {
        this.userProfile = new UserProfile()
    }

    public async createNewUserProfile(profileName: string): Promise<boolean> {
        return await this.userProfile.createNewUserProfile(profileName)
    }
}

export class ViewUserProfilesController {
    private userProfile: UserProfile

    constructor() {
        this.userProfile = new UserProfile()
    }

    public async viewUserProfiles(): Promise<string[]> {
        return await this.userProfile.viewUserProfiles()
    }
}

export class UpdateUserProfileController {
    private userProfile: UserProfile

    constructor() {
        this.userProfile = new UserProfile()
    }

    public async updateUserProfile(
        oldProfileName: string,
        newProfileName: string
    ): Promise<void> {
        return await this.userProfile.updateUserProfiles(
            oldProfileName,
            newProfileName
        )
    }
}
