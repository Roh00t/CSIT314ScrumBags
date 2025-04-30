import { UserProfilesSelect, userProfilesTable } from '../db/schema/userProfiles'
import { UserProfileNotFoundError } from '../shared/exceptions'
import { DrizzleClient } from '../shared/constants'
import { drizzle } from 'drizzle-orm/node-postgres'
import { ilike } from 'drizzle-orm'
import { eq } from 'drizzle-orm'

export class UserProfile {
    private db: DrizzleClient

    constructor() {
        this.db = drizzle(process.env.DATABASE_URL!)
    }

    /**
     * Create new user profile 
     */
    public async createNewUserProfile(profileName: string): Promise<boolean> {
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
     * US-9: As a user admin, I want to view user profiles 
     *       so that I can access profile information
     */
    public async viewUserProfiles(): Promise<{ name: string, isSuspended: boolean }[]> {
        const result = await this.db
            .select({
                label: userProfilesTable.label,
                isSuspended: userProfilesTable.isSuspended
            })
            .from(userProfilesTable)

        return result.map(profile => ({
            name: profile.label,
            isSuspended: profile.isSuspended
        }))
    }

    /**
     * US-10: As a user admin, I want to update user profiles 
     *        so that I can keep profile information up to date
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
     * US-11: As a user admin, I want to suspend user profiles 
     *        so that I can restrict user access if necessary
     */
    public async suspendUserProfile(profileName: string): Promise<void> {
        await this.db
            .update(userProfilesTable)
            .set({ isSuspended: true })
            .where(eq(userProfilesTable.label, profileName))
    }

    /**
     * TODO: Remove this from submission (??)
     * Unsuspend user profile 
     */
    public async unsuspendUserProfile(profileName: string): Promise<void> {
        await this.db
            .update(userProfilesTable)
            .set({ isSuspended: false })
            .where(eq(userProfilesTable.label, profileName))
    }

    /**
     * US-12: As a user admin, I want to search for user profiles 
     *        so that I can find specific user profiles
     */
    public async searchUserProfile(search: string): Promise<UserProfilesSelect> {
        const [profile] = await this.db
            .select()
            .from(userProfilesTable)
            .where(ilike(userProfilesTable.label, `%${search}%`)) // partial + case-insensitive
            .limit(1)

        if (!profile) {
            throw new UserProfileNotFoundError("User profile doesn't exist")
        }
        return profile
    }
}
