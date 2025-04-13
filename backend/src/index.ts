import userAccountsRouter from './routers/userAccountsRouter'
import connectPgSimple from 'connect-pg-simple'
import session from 'express-session'
import express, { urlencoded } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import userProfilesRouter from './routers/userProfilesRouter'

dotenv.config({
    path: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env',
    override: true
})

export const app = express()
app.use(express.json())
app.use(urlencoded({ extended: false }))
app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true
    })
)
app.use(
    session({
        store: new (connectPgSimple(session))({
            createTableIfMissing: true,
            conString: process.env.DATABASE_URL
        }),
        secret: process.env.SESSION_SECRET as string,
        resave: false,
        saveUninitialized: false,
        cookie: {
            sameSite: 'lax',
            httpOnly: true,
            maxAge: 1000 * 60 * 5 // 5 minutes
            // secure: process.env.NODE_ENV === 'prod'
        }
    })
)

app.use('/api/user-accounts/', userAccountsRouter)
app.use('/api/user-profiles/', userProfilesRouter)

const APP_PORT = process.env.PORT || 3000
app.listen(APP_PORT, async () => {
    console.log('Server listening on port', APP_PORT)
})
