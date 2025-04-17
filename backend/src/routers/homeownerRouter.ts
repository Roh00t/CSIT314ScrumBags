import { Router } from "express"
import { requireAuthMiddleware } from "../shared/middleware"
import { UserAccountResponse } from "../shared/dataClasses"
import { AddToShortlistController, ViewShortListController } from "../controllers/homeownerControllers"
import { StatusCodes } from "http-status-codes"

const homeownerRouter = Router()

declare module 'express-session' {
    interface SessionData {
        user: UserAccountResponse
    }
}

const addToShortlistController = new AddToShortlistController()
const viewShortlistController = new ViewShortListController()

// 👇 Add route to shortlist a cleaner
homeownerRouter.post('/', requireAuthMiddleware, async (req, res): Promise<void> => {
    const homeownerID = (req.session.user as UserAccountResponse).id
    const { cleanerID } = req.body

    try {
        await addToShortlistController.addToShortlist(homeownerID, cleanerID)
        res.status(StatusCodes.OK).json({
            message: "Shortlist successful"
        })
    } catch (error: any) {
        res.status(StatusCodes.BAD_REQUEST).json({
            error: error.message || "Shortlist failed"
        })
    }
})

homeownerRouter.get('/', requireAuthMiddleware, async(req, res): Promise<void> => {
    const homeownerID = (req.session.user as UserAccountResponse).id

    try {
        const shortlistedCleaners = await viewShortlistController.viewShortlist(homeownerID)
        res.status(StatusCodes.OK).json({
            message: "Shortlist retrieved successfully",
            data: shortlistedCleaners
        });
    } catch (error: any) {
        res.status(StatusCodes.BAD_REQUEST).json({
            error: error.message || "Failed to retrieve shortlist"
        });
    }
})

export default homeownerRouter
