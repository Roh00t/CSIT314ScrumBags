import { UserProfilesSelect, userProfilesTable } from '../db/schema/userProfiles'
import { drizzle } from 'drizzle-orm/node-postgres'
import { DrizzleClient } from '../shared/constants'
import { eq, ilike } from 'drizzle-orm'
import { UserProfileNotFoundError } from '../shared/exceptions'

export class UserProfile {
    private db: DrizzleClient

    constructor() {
        this.db = drizzle(process.env.DATABASE_URL!)
    }

    /**
     * Create new user profile 
     */
    public async createNewUserProfile(
        profileName: string
    ): Promise<boolean> {
        try {
            await this.db
                .insert(userProfilesTable)
                .values({ label: profileName })
            return true
        } catch (err) {
            return false
        }
    }

    /**
     * View user profile 
     */
    public async viewUserProfiles(): Promise<string[]> {
        const result = await this.db
            .select({ label: userProfilesTable.label })
            .from(userProfilesTable)
        return result.map(res => res.label)
    }

    /**
     *  Update user profiles
     */
    public async updateUserProfile(
        oldProfileName: string,
        newProfileName: string
    ): Promise<void> {
        await this.db
            .update(userProfilesTable)
            .set({ label: newProfileName })
            .where(eq(userProfilesTable.label, oldProfileName))
    }

    /**
     * Suspend user profile 
     */
    public async suspendUserProfile(profileName: string): Promise<void> {
        await this.db
            .update(userProfilesTable)
            .set({ isSuspended: true })
            .where(eq(userProfilesTable.label, profileName))
    }

    /**
     * Search user profiles
     */
    public async searchUserProfile(search: string): Promise<UserProfilesSelect> {
        const [profile] = await this.db
            .select()
            .from(userProfilesTable)
            .where(eq(userProfilesTable.label, search))
            .limit(1)

        if (!profile) {
            throw new UserProfileNotFoundError("User profile doesn't exist")
        }
        return profile
    }
}
