import { userProfilesTable } from '../schema/userProfiles'
import { createUserAccount } from './userAccountHelpers'
import { DrizzleClient } from '../../shared/constants'
import { drizzle } from 'drizzle-orm/node-postgres'
import { clearTheDatabase } from './shared'
import { Pool } from 'pg'
import 'dotenv/config'

const driver = async (db: DrizzleClient): Promise<void> => {
    await clearTheDatabase(db)

    // ---- Insert default profiles
    await db.insert(userProfilesTable).values([
        { label: 'homeowner' },
        { label: 'cleaner' },
        { label: 'platform manager' },
        { label: 'user admin' }
    ]).onConflictDoNothing()

    // ----- Generate a bunch of random user accounts
    await createUserAccount(db, "homeowner", "homeowner", "homeowner")
    await createUserAccount(db, "cleaner", "cleaner", "cleaner")
    await createUserAccount(db, "platform manager", "platform manager", "platform manager")
    await createUserAccount(db, "user admin", "user admin", "user admin")
    console.log("Successfully seeded the database (only base accounts)!")
}

const main = async (): Promise<void> => {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL! })
    try {
        const db = drizzle(pool)
        await driver(db)
    } catch (err) {
        console.error('Error with seeding the database: ', (err as Error).message)
    } finally {
        await pool.end()
    }
}
main()

