import { requireAuthMiddleware } from "../shared/middleware"
import { Router } from "express"
import { UserAccountData } from "../shared/dataClasses"
import { StatusCodes } from "http-status-codes"
import { ViewCleanerServiceHistoryController } from "../controllers/cleanerControllers"


const cleanersRouter = Router()

cleanersRouter.get(
    '/services',
    requireAuthMiddleware,
    async (req, res): Promise<void> => {

    }
)

cleanersRouter.get(
    '/serviceHistory',
    requireAuthMiddleware,
    async (req, res): Promise<void> => {
        const cleanerID = (req.session.user as UserAccountData).id
        const { service, startDate, endDate } = req.body
        try {
            console.log({ cleanerID, service, startDate, endDate })
            const serviceHistory = await new ViewCleanerServiceHistoryController()
                .viewCleanerServiceHistory(cleanerID, service, new Date(startDate), new Date(endDate))
            res.status(StatusCodes.OK).json({
                message: "Service history retrieved successfully",
                data: serviceHistory
            })
        } catch (error: any) {
            res.status(StatusCodes.BAD_REQUEST).json({
                error: error.message || "Failed to retrieve service history"
            })
        }
    }
)

export default cleanersRouter