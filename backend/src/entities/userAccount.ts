import bcrypt from 'bcrypt'
import { eq } from "drizzle-orm"
import { drizzle } from "drizzle-orm/node-postgres"
import { userAccountsTable, userProfilesTable } from "../misc/schema"
import { DrizzleClient, GLOBALS } from "../misc/constants"

export default class UserAccount {
    private db: DrizzleClient

    constructor() {
        this.db = drizzle(process.env.DATABASE_URL!) // Establish database connection
    }
    
    /**
     * @param password The PLAINTEXT password (not encoded)
     */
    public async createNewUserAccount(
        createAs: string,
        username: string,
        password: string
    ): Promise<boolean> {
        const salt = await bcrypt.genSalt(GLOBALS.SALT_ROUNDS)
        const hashedPassword = await bcrypt.hash(password, salt)

        const [userProfile] = await this.db.select()
            .from(userProfilesTable)
            .where(eq(userProfilesTable.label, createAs))

        if (!userProfile) return false

        await this.db.insert(userAccountsTable)
            .values({
                username: username,
                password: hashedPassword,
                userProfileId: userProfile.id,
            })
        return true
    }

    /**
     * @param password The PLAINTEXT password (not encoded)
     */
    public async login(username: string, password: string): Promise<boolean> {
        const [retrievedUser] = await this.db
            .select().from(userAccountsTable)
            .where(eq(userAccountsTable.username, username))

        if (!retrievedUser) return false

        let isLoginSuccessful = false
        bcrypt.compare(password, retrievedUser.password, (err, res) => {
            if (err) isLoginSuccessful = false
            if (res) isLoginSuccessful = true
        })
        return isLoginSuccessful
    }
}