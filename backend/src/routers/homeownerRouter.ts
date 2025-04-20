import { Router } from "express"
import { requireAuthMiddleware } from "../shared/middleware"
import { UserAccountData } from "../shared/dataClasses"
import {
    AddToShortlistController,
    ViewServiceHistoryController,
    ViewShortListController
} from "../controllers/homeownerControllers"
import { StatusCodes } from "http-status-codes"

const homeownerRouter = Router()

declare module 'express-session' {
    interface SessionData {
        user: UserAccountData
    }
}

// 👇 Add route to shortlist a cleaner
homeownerRouter.post('/', requireAuthMiddleware, async (req, res): Promise<void> => {
    const homeownerID = (req.session.user as UserAccountData).id
    const { cleanerID } = req.body

    try {
        await new AddToShortlistController().addToShortlist(homeownerID, cleanerID)
        res.status(StatusCodes.OK).json({
            message: "Shortlist successful"
        })
    } catch (error: any) {
        res.status(StatusCodes.BAD_REQUEST).json({
            error: error.message || "Shortlist failed"
        })
    }
})

homeownerRouter.get('/', requireAuthMiddleware, async (req, res): Promise<void> => {
    const homeownerID = (req.session.user as UserAccountData).id

    try {
        const shortlistedCleaners = await new ViewShortListController().viewShortlist(homeownerID)
        res.status(StatusCodes.OK).json({
            message: "Shortlist retrieved successfully",
            data: shortlistedCleaners
        })
    } catch (error: any) {
        res.status(StatusCodes.BAD_REQUEST).json({
            error: error.message || "Failed to retrieve shortlist"
        })
    }
})

homeownerRouter.get('/servicehistory', requireAuthMiddleware, async (req, res): Promise<void> => {
    const homeownerID = (req.session.user as UserAccountData).id
    const { service } = req.body
    const { date } = req.body

    try {
        const serviceHistory = await new ViewServiceHistoryController().viewServiceHistory(
            homeownerID, service, date
        )
        res.status(StatusCodes.OK).json({
            message: "Service history retrieved successfully",
            data: serviceHistory
        })
    } catch (error: any) {
        res.status(StatusCodes.BAD_REQUEST).json({
            error: error.message || "Failed to retrieve service history"
        })
    }
})

export default homeownerRouter
