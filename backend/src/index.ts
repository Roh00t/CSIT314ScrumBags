import express, { Request, Response } from "express"
import dotenv from 'dotenv'
import path from 'path'

process.env.NODE_ENV = "dev"
const envPath = path.resolve(
    __dirname,
    `../.env${process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''}`
);
dotenv.config({ path: envPath })

const app = express()
app.use(express.json())

app.post("/", async (req: Request, res: Response) => {
    const data = req.body
    res.status(200).json({ "Here's the data we received: ": data })
})

const APP_PORT = process.env.PORT || 3000
app.listen(APP_PORT, async () => {
    console.log("Server listening on port", APP_PORT);
})