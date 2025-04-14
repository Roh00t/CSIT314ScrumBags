import { UserProfile } from "../entities/userProfile"

export class CreateNewUserProfileController {
    private userProfile: UserProfile

    constructor() {
        this.userProfile = new UserProfile
    }

    public async createNewUserProfile(profileName: string): Promise<boolean> {
        try {
            return await this.userProfile.createNewUserProfile(profileName)
        } catch (err) {
            throw err
        }
    }
}

export class ViewUserProfilesController {
    private userProfile: UserProfile

    constructor() {
        this.userProfile = new UserProfile
    }

    public async viewUserProfiles(): Promise<string[]> {
        try {
            return await this.userProfile.viewUserProfiles()
        } catch (err) {
            throw err
        }
    }
}