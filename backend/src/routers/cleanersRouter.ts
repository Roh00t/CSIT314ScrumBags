import { requireAuthMiddleware } from "../shared/middleware"
import { UserAccountData } from "../shared/dataClasses"
import { StatusCodes } from "http-status-codes"
import {
    SearchCleanerServiceHistoryController,
    ViewCleanerServiceHistoryController,
    ViewShortlistedBookingsController
} from "../controllers/cleanerControllers"
import { Router } from "express"

const cleanersRouter = Router()


cleanersRouter.get('/shortlist/count',
    requireAuthMiddleware, 
    async (req, res): Promise<void> => {
        try{
            const cleanerID = req.session.user?.id as number
            const shortlistedBookingsCount = await new ViewShortlistedBookingsController().viewNoOfShortlistedHomeowners(cleanerID)
            res.status(StatusCodes.OK).json(shortlistedBookingsCount)
        } catch (error: any) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: error.message || "Failed to retrieve service history"
            })
        }
    }
)
/**
 * US-22: As a cleaner, I want to search the history of my confirmed services, 
 *        filtered by services, date period, so that I can easily find past jobs
 * 
 * US-23: As a cleaner, I want to view the history of my 
 *        confirmed services, filtered by services, date period 
 *        so that I can track my work and manage my schedule
 * 
 * Conditionally calls the appropriate controller ('view' vs 'search') 
 * based on whether the 'service' field exists within the response body.
 * Still technically adheres to BCE, since it's separate 
 * controllers for separate use cases/stories
 */
cleanersRouter.post(
    '/serviceHistory',
    requireAuthMiddleware,
    async (req, res): Promise<void> => {
        try {
            const cleanerID = (req.session.user as UserAccountData).id
            const { service, startDate, endDate } = req.body

            if (service && String(service).length > 0) { //===== US-22 ======
                const searchedServiceHistory =
                    await new SearchCleanerServiceHistoryController()
                        .searchCleanerServiceHistory(
                            cleanerID,
                            service,
                            startDate ? new Date(startDate) : null,
                            endDate ? new Date(endDate) : null
                        )
                res.status(StatusCodes.OK).json({
                    message: "Service history retrieved successfully 1",
                    data: searchedServiceHistory
                })
            } else { //====== US-23 ========
                const allServiceHistory = await new ViewCleanerServiceHistoryController()
                    .viewCleanerServiceHistory(
                        cleanerID,
                        startDate ? new Date(startDate) : null,
                        endDate ? new Date(endDate) : null
                    )
                res.status(StatusCodes.OK).json({
                    message: "Service history retrieved successfully 2",
                    data: allServiceHistory
                })
            }
        } catch (error: any) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: error.message || "Failed to retrieve service history"
            })
        }
    }
)

export default cleanersRouter
