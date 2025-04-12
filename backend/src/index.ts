import {
    InvalidCredentialsError, UserAccountNotFound, UserAccountSuspendedError
} from "./exceptions/userExceptions";
import { CreateNewUserAccountController, CreateNewUserProfileController, GetUserProfilesController } from "./controllers/userControllers";
import { LoginController } from "./controllers/userControllers";
import { StatusCodes } from "http-status-codes";
import connectPgSimple from "connect-pg-simple";
import session from "express-session";
import express, { urlencoded } from "express";
import dotenv from 'dotenv';
import { UserAccountResponse } from "./dto/userDTOs";
import cors from 'cors';


dotenv.config({
    path: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env',
    override: true
})

export const app = express()
// Enable CORS for specific origin
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }))

app.use(express.json())
app.use(urlencoded({ extended: false }))
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
        maxAge: 1000 * 60 * 5, // 5 minutes
        // secure: process.env.NODE_ENV === 'prod'
    }
}))

app.post("/api/user_account/create", async (req, res): Promise<void> => {
    const { createAs, username, password } = req.body

    try {
        const controller = new CreateNewUserAccountController();
        const createSuccess = await controller.createNewUserAccount(createAs, username, password);
      
        if (createSuccess) {
          res.status(StatusCodes.CREATED).send("Account created successfully");
        } else {
          console.log("Account creation failed due to conflict."); // Log the reason for failure
          res.status(StatusCodes.CONFLICT).send("Account creation failed");
        }
      } catch (error) {
        console.error("Error during account creation:", error); // Log the error for further insights
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Internal Server Error");
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
            (req.session as any).user = userAccRes as UserAccountResponse
            res.status(StatusCodes.OK).json(userAccRes)
        })
    }
    catch (err) {
        if (err instanceof UserAccountNotFound) {
            res.status(StatusCodes.NOT_FOUND).send()
        }
        else if (err instanceof InvalidCredentialsError) {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid credentials" })
        }
        else if (err instanceof UserAccountSuspendedError) {
            res.status(StatusCodes.LOCKED).json({ message: "Account is suspended" })
        }
        else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: (err as Error).message })
        }
    }
})

app.post("/api/user_account/logout", async (req, res): Promise<void> => {
    try {
        await req.session.destroy(_ => {})
        res.status(StatusCodes.OK).json({ message: "Logout successful" })
    }
    catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: (err as Error).message })
    }
})

app.post('/api/user_profile', async (req, res): Promise<void> => {
    try {
        const { profileName } = req.body
        const controller = new CreateNewUserProfileController()
        await controller.createNewUserProfile(profileName)
        res.status(StatusCodes.CREATED).json({ message: "Success" })
    }
    catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: (err as Error).message
        })
    }
})

app.get('/api/user_profile', async (_, res): Promise<void> => {
    try {
        const profiles = await new GetUserProfilesController().getUserProfiles()
        res.status(StatusCodes.OK).json({
            message: "Successs",
            data: profiles
        })
    }
    catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: (err as Error).message
        })
    }
})

const APP_PORT = process.env.PORT || 3000
app.listen(APP_PORT, async () => {
    console.log("Server listening on port", APP_PORT);
})