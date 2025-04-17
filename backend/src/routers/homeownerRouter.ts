import { Router } from "express";
import { UserAccountResponse } from "../shared/dataClasses";
import { 
    AddToShortlistController 
} from "../controllers/homeownersControllers";
import { StatusCodes } from "http-status-codes";

const homeownerRouter = Router()

declare module 'express-session' {
    interface SessionData {
        user: UserAccountResponse
    }
}

homeownerRouter.post('/addtoshortlist', async (req, res): Promise<void> =>{
    try {
        await new AddToShortlistController().addToShortlist(req.body.service)
        res.status(StatusCodes.CREATED).send()
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: (err as Error).message
        })
    }
})

export default homeownerRouter