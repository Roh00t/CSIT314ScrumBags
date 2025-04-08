import express, { Request, Response } from "express"
import session from "express-session";
import 'dotenv/config'

const app = express()
app.use(express.json())
app.use(session({
    secret: 'lsijefljfosjjljij',
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: 'lax',
        httpOnly: true,
        maxAge: 1000 * 60 * 5,
        secure: process.env.NODE_ENV === 'prod'
    }
}))

app.get("/", async (_, res: Response) => {
   res.send("Hello from the server") 
})

app.post("/", async (req: Request, res: Response) => {
    const data = req.body
    res.status(200).json({ "Here's the data we received: ": data })
})

const APP_PORT = process.env.PORT || 3000
app.listen(APP_PORT, async () => {
    console.log("Server listening on port", APP_PORT);
})