import { drizzle } from "drizzle-orm/node-postgres"
import { DrizzleClient } from "../shared/constants"

export class ServiceCategory {
    private db: DrizzleClient

    constructor() {
        this.db = drizzle(process.env.DATABASE_URL!)
    }
}