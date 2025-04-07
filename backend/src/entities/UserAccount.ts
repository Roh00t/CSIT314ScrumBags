import { drizzle, NodePgClient, NodePgDatabase } from "drizzle-orm/node-postgres"

export default class UserAccount {
    db: NodePgDatabase<Record<string, never>> & { $client: NodePgClient }

    constructor() {
        this.db = drizzle(process.env.DATABASE_URL!)
        // await this.db.select(userAccountsTable)
    }
}