import { userProfilesTable } from '../db/schema/userProfiles'
import { drizzle } from 'drizzle-orm/node-postgres'
import { DrizzleClient } from '../shared/constants'
import { eq } from 'drizzle-orm'

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
     * View user profile & Search through user profile
     */
    public async viewUserProfiles(
        profileName: string | null
    ): Promise<string[]> {
        type ProfileType = { label: string }

        const profiles: ProfileType[] = profileName
            ? await this.db
                .select({ label: userProfilesTable.label })
                .from(userProfilesTable)
                .where(eq(userProfilesTable.label, profileName))
            : await this.db
                .select({ label: userProfilesTable.label })
                .from(userProfilesTable)

        return profiles.map(p => p.label)
    }

    /**
     *  Update user profiles
     */
    public async updateUserProfiles(
        oldProfileName: string,
        newProfileName: string
    ): Promise<void> {
        await this.db
            .update(userProfilesTable)
            .set({ label: newProfileName })
            .where(eq(userProfilesTable.label, oldProfileName))
    }
}
