import { 
    InvalidCredentialsError, UserAccountNotFound, UserAccountSuspendedError 
} from "./exceptions/userExceptions";
import { CreateNewUserAccountController } from "./controllers/userControllers";
import { LoginController } from "./controllers/userControllers";
import { StatusCodes } from "http-status-codes";
import connectPgSimple from "connect-pg-simple";
import session from "express-session";
import express from "express";
import 'dotenv/config';

const app = express()
app.use(express.json())
app.use(session({
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
        maxAge: 1000 * 60 * 5,
        secure: process.env.NODE_ENV === 'prod'
    }
}))

app.get("/", async (_, res) => {
    res.send("Hello from the server")
})

app.post("/api/user_account/create", async (req, res): Promise<void> => {
    const { createAs, username, password } = req.body

    const controller = new CreateNewUserAccountController()
    const createSuccess = await controller.createNewUserAccount(createAs, username, password)

    if (createSuccess) {
        res.status(StatusCodes.CREATED).send("Account created successfully")
        return
    } else {
        res.status(StatusCodes.CONFLICT).send("Account creation FAILLEDDD")
        return
    }
})

app.post("/api/user_account/login", async (req, res): Promise<void> => {
    try {
        const { username, password } = req.body
        const controller = new LoginController()
        const userAccRes = await controller.login(username, password)
        req.session.regenerate(err => {
            if (err) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ message: "Express error: " + err })
                return
            }
            (req.session as any).user = userAccRes
            res.status(StatusCodes.OK).json(userAccRes)
        })
    }
    catch (err) {
        if (err instanceof UserAccountNotFound) {
            res.status(StatusCodes.NOT_FOUND)
        } else if (err instanceof InvalidCredentialsError) {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid credentials" })
        } else if (err instanceof UserAccountSuspendedError) {
            res.status(StatusCodes.LOCKED).json({ message: "Account is suspended" })
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: (err as Error).message })
        }
    }
})

const APP_PORT = process.env.PORT || 3000
app.listen(APP_PORT, async () => {
    console.log("Server listening on port", APP_PORT);
})