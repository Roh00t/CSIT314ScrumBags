import {
    InvalidCredentialsError,
    UserAccountNotFound,
    UserAccountSuspendedError
} from '../exceptions/exceptions'
import { userProfilesTable } from '../db/schema/userProfiles'
import { userAccountsTable } from '../db/schema/userAccounts'
import { shortlistedCleanersTable } from '../db/schema/shortlistedCleaners'
import { UserAccountResponse } from '../shared/dataClasses'
import { DrizzleClient } from '../shared/constants'
import { drizzle } from 'drizzle-orm/node-postgres'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcrypt'
import { string } from 'zod'


export default class UserAccount {
    private db: DrizzleClient

    constructor() {
        this.db = drizzle(process.env.DATABASE_URL!)
    }

    /**
     * @param password The ENCODED password
     */
    public async createNewUserAccount(
        createAs: string,
        username: string,
        password: string
    ): Promise<boolean> {
        const [userProfile] = await this.db
            .select()
            .from(userProfilesTable)
            .where(eq(userProfilesTable.label, createAs))

        if (!userProfile) {
            return false
        }

        await this.db.insert(userAccountsTable).values({
            username: username,
            password: password,
            userProfileId: userProfile.id
        })
        return true
    }

    /**
     * @param password The PLAINTEXT password (not encoded)
     */
    public async login(
        username: string,
        password: string
    ): Promise<UserAccountResponse> {
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
            throw new UserAccountNotFound(
                "Couldn't find user of username: " + username
            )
        }

        const areCredentialsVerified = await bcrypt.compare(
            password,
            retrievedUser.password
        )
        if (!areCredentialsVerified) {
            throw new InvalidCredentialsError(
                'Invalid credentials entered for user of username: ' + username
            )
        }

        if (retrievedUser.isSuspended) {
            throw new UserAccountSuspendedError(
                'User account ' + retrievedUser.username + ' is suspended'
            )
        }

        return {
            id: retrievedUser.id,
            username: retrievedUser.username,
            userProfile: retrievedUser.userProfileLabel
        } as UserAccountResponse
    }

    public async viewUserAccounts(): Promise<UserAccountResponse[]> {
        const allUsers = await this.db
            .select({
                id: userAccountsTable.id,
                username: userAccountsTable.username,
                profileLabel: userProfilesTable.label
            })
            .from(userAccountsTable)
            .leftJoin(
                userProfilesTable,
                eq(userAccountsTable.userProfileId, userProfilesTable.id)
            )

        return allUsers.map((u) => {
            return {
                id: u.id,
                username: u.username,
                userProfile: u.profileLabel
            } as UserAccountResponse
        })
    }
    // This async Function only retrieves Cleaner names under the assumption that
    // There will be another page to show the Services provided by the Cleaner.
    // 15042025 2257 Hours
    public async viewCleaners(): Promise<string[]> {
        const queryForCleaners = await this.db
            .select({ cleanerName: userAccountsTable.username })
            .from(userAccountsTable)
            .leftJoin(
                userProfilesTable,
                eq(userAccountsTable.userProfileId, userProfilesTable.id)
            )
            .where(eq(userProfilesTable.label, 'cleaner'))
        return queryForCleaners.map((q) => q.cleanerName)
    }

    public async addToShortlist(homeownerID: number, cleanerID: number): Promise<void> {
        // const [shortlistEntry] = await this.db
        //     .select({ id: userAccountsTable.id })
        //     .from(userAccountsTable)

        await this.db
            .insert(shortlistedCleanersTable)
            .values({
                homeownerID, 
                cleanerID
            })
    }

    public async ViewShortlist(homeownerID: number): Promise<string[]> {
        const shortlistedCleaners = await this.db
        .select({ cleanerID: shortlistedCleanersTable.cleanerID })
        .from(shortlistedCleanersTable)
        .where(eq(shortlistedCleanersTable.homeownerID, homeownerID))
    
        // Retrieve cleaner names based on the cleanerIDs from shortlistedCleaners
        const cleanerNames = await Promise.all(shortlistedCleaners.map(async (entry) => {
            const [cleaner] = await this.db
                .select({ cleanerName: userAccountsTable.username })
                .from(userAccountsTable)
                .where(eq(userAccountsTable.id, entry.cleanerID))
            
            return cleaner?.cleanerName || "Unknown Cleaner"
        }));

        return cleanerNames
    }

    public async updateUserAccount(
        userID: number,
        updateAs: string,
        updatedUsername: string,
        updatedPassword: string
    ): Promise<void> {
        const [userProfile] = await this.db
        .select()
        .from(userProfilesTable)
        .where(eq(userProfilesTable.label, updateAs))

        await this.db
            .update(userAccountsTable)
            .set({
                username: updatedUsername,
                password: updatedPassword,
                userProfileId: userProfile.id
            })
            .where(eq(userAccountsTable.id, userID))
    }
}