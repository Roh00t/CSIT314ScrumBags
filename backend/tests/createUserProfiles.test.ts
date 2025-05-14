import { shortlistedServicesTable } from '../src/db/schema/shortlistedServices'
import { serviceCategoriesTable } from '../src/db/schema/serviceCategories'
import { servicesProvidedTable } from '../src/db/schema/servicesProvided'
import { serviceBookingsTable } from '../src/db/schema/serviceBookings'
import { userAccountsTable } from '../src/db/schema/userAccounts'
import { userProfilesTable } from '../src/db/schema/userProfiles'
import { UserAccountData } from '../src/shared/dataClasses'
import { DrizzleClient } from '../src/shared/constants'
import UserAccount from '../src/entities/userAccount'
import { drizzle } from 'drizzle-orm/node-postgres'
import { server } from '../src/index'
import { eq, sql } from 'drizzle-orm'
import dotenv from 'dotenv'
import { Pool } from 'pg'
import { CreateNewUserProfileController } from '../src/controllers/userAdminControllers'

describe('Login', (): void => {
    let db: DrizzleClient
    let pgPool: Pool

    const envPath = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env'
    dotenv.config({ path: envPath, override: true })

    beforeAll(async (): Promise<void> => {
        pgPool = new Pool({ connectionString: process.env.DATABASE_URL })
        db = drizzle(pgPool)

        try {
            await db
                .insert(userProfilesTable)
                .values([
                    { label: 'cleaner' },
                    { label: 'homeowner' },
                    { label: 'platform manager' },
                    { label: 'homeowner' }
                ])
                .onConflictDoNothing({ target: userProfilesTable.label })
        } catch (err) {
            console.error('Error in beforeAll: ', (err as Error).message)
            throw err
        }
    })

    beforeEach(async (): Promise<void> => {
        const createSuccess = await new UserAccount().createNewUserAccount(
            "homeowner", "homeowner", "homeowner"
        )
        if (!createSuccess) {
            throw new Error("Failure to create test account - unable to proceed with tests cases")
        }
    })

    afterEach(async (): Promise<void> => { await db.delete(userAccountsTable) })

    afterAll(async (): Promise<void> => {
        try {
            await db.execute(sql`
                TRUNCATE TABLE 
                ${userProfilesTable}, 
                ${userAccountsTable},
                ${serviceBookingsTable},
                ${servicesProvidedTable},
                ${serviceCategoriesTable},
                ${shortlistedServicesTable}
                RESTART IDENTITY CASCADE;
            `)
        } catch (err) {
            console.error('Error in afterAll: ', (err as Error).message)
        } finally {
            if (pgPool) {
                await pgPool.end()
            }
            server.close()
        }
    })

    it('Creates a user profile successfully', async (): Promise<void> => {
        const createSuccess =
            await new CreateNewUserProfileController()
                .createNewUserProfile("TestProfile")

        expect(createSuccess).toBe(true)
    })

    it('Tries (and fails) to create duplicate profile', async (): Promise<void> => {
        const createSuccess =
            await new CreateNewUserProfileController()
                .createNewUserProfile("homeowner")

        expect(createSuccess).toBe(false)
    })

    it('Tries (and fails) to create empty profile', async (): Promise<void> => {
        const createSuccess =
            await new CreateNewUserProfileController()
                .createNewUserProfile("")

        expect(createSuccess).toBe(false)
    })

    it('Tries (and fails) to create whitespace-only profile', async (): Promise<void> => {
        const createSuccess =
            await new CreateNewUserProfileController()
                .createNewUserProfile("      ")

        expect(createSuccess).toBe(false)
    })
})