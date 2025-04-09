import {
    InvalidCredentialsError, UserAccountNotFound, UserAccountSuspendedError
} from '../exceptions/userExceptions'
import { UserAccountResponse } from '../dto/userDTOs'
import { drizzle } from "drizzle-orm/node-postgres"
import { eq } from "drizzle-orm"
import bcrypt from 'bcrypt'
import { DrizzleClient } from '../shared/constants'
import { userProfilesTable } from '../db/schema/userProfiles'
import { userAccountsTable } from '../db/schema/userAccounts'

export default class UserAccount {
    private db: DrizzleClient 

    constructor() {
        this.db = drizzle(process.env.DATABASE_URL!) // Establish database connection
    }

    /**
     * @param password The ENCODED password
     */
    public async createNewUserAccount(
        createAs: string,
        username: string,
        password: string
    ): Promise<boolean> {
        const [userProfile] = await this.db.select()
            .from(userProfilesTable)
            .where(eq(userProfilesTable.label, createAs))

        if (!userProfile) return false

        await this.db.insert(userAccountsTable)
            .values({
                username: username,
                password: password,
                userProfileId: userProfile.id,
            })
        return true
    }

    /**
     * @param password The PLAINTEXT password (not encoded)
     * @returns string uuid of the logged-in user, empty string if unsuccessful
     */
    public async login(username: string, password: string): Promise<UserAccountResponse> {
        const [retrievedUser] = await this.db
            .select({
                id: userAccountsTable.id,
                username: userAccountsTable.username,
                password: userAccountsTable.password,
                isSuspended: userAccountsTable.isSuspended,
                userProfileLabel: userProfilesTable.label
            })
            .from(userAccountsTable)
            .leftJoin(
                userProfilesTable,
                eq(userAccountsTable.userProfileId, userProfilesTable.id)
            )
            .where(eq(userAccountsTable.username, username))
            .limit(1)

        if (!retrievedUser) {
            throw new UserAccountNotFound("Couldn't find user of username: " + username)
        }

        const areCredentialsVerified = await bcrypt.compare(password, retrievedUser.password)
        if (!areCredentialsVerified) {
            throw new InvalidCredentialsError("Invalid credentials entered for user of username: " + username)
        }

        if (retrievedUser.isSuspended) {
            throw new UserAccountSuspendedError(
                "User account " + retrievedUser.username + " is suspended"
            )
        }

        return {
            id: retrievedUser.id,
            username: retrievedUser.username,
            userProfile: retrievedUser.userProfileLabel
        } as UserAccountResponse
    }
}