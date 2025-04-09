// import request from 'supertest'
// import { app } from '../src/index'
import { drizzle } from 'drizzle-orm/node-postgres';
import { userProfilesTable } from '../src/db/schema/userProfiles';

describe('Login path test', () => {
    beforeAll(async () => {
        const db = drizzle(process.env.DATABASE_URL!)
        try {
            db.insert(userProfilesTable).values([
                { label: "cleaner" },
                { label: "homeowner" },
                { label: "platform manager" },
                { label: "user admin" }
            ])
        }
        catch (err) {}
    })

    it('POST /api/user_account/login ---> Returns 200 OK', async () => { 
        // TODO
        // Create user in database (insert ENCODED password)
        // Attempt to login via this endpoint (use PLAINTEXT password)
        expect(1 === 1)
    })

    it('POST /login ---> Returns 404 NOT FOUND', () => { })

    it('POST /login ---> Returns 401 UNAUTHORIZED', () => { })

    it('POST /login ---> Returns 423 LOCKED', () => { })
})