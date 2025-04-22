import userAccountsRouter from './routers/userAccountsRouter'
import userProfilesRouter from './routers/userProfilesRouter'
import servicesRouter from './routers/servicesRouter'
import platformManagerRouter from './routers/platformManagerRouter'
import homeownerRouter from './routers/homeownerRouter'
import connectPgSimple from 'connect-pg-simple'
import express, { urlencoded } from 'express'
import session from 'express-session'
import cors from 'cors'
import 'dotenv/config'

const app = express()
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
            maxAge: 1000 * 60 * 60 * 24 * 365 // 365 days - Because why not
            // secure: process.env.NODE_ENV === 'prod'
        }
    })
)

app.use('/api/user-accounts/', userAccountsRouter)
app.use('/api/user-profiles/', userProfilesRouter)
app.use('/api/services/', servicesRouter)
app.use('/api/platform-manager/', platformManagerRouter)
app.use('/api/homeowner/', homeownerRouter)

const APP_PORT = process.env.PORT || 3001
const server = app.listen(APP_PORT, () => {
    console.log('Server listening on port', APP_PORT)
})

export { server, app }