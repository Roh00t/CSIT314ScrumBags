import { userProfilesTable } from "../db/schema/userProfiles"
import { drizzle } from "drizzle-orm/node-postgres"
import { DrizzleClient } from "../shared/constants"

export class UserProfile {
    private db: DrizzleClient

    constructor() { this.db = drizzle(process.env.DATABASE_URL!) }

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

    public async viewUserProfiles(): Promise<string[]> {
        type ProfileType = { label: string | null }
        const profiles: ProfileType[] = await this.db
            .select({ label: userProfilesTable.label })
            .from(userProfilesTable)
        const profileLabels = profiles.map(p => p.label || '')
        return profileLabels
    }
}