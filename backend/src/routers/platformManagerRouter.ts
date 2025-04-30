import { UserAccountData } from '../shared/dataClasses'
import {
    GenerateWeeklyReportController,
    GenerateDailyReportController,
    GenerateMonthlyReportController
} from '../controllers/platformManagerControllers'
import { StatusCodes } from 'http-status-codes'
import { Router } from 'express'

const platformManagerRouter = Router()

declare module 'express-session' {
    interface SessionData {
        user: UserAccountData
    }
}

/**
 * US-38: As a Platform Manager, I want to generate daily reports so 
 *        that I can view the daily statistics of cleaners and services
 */
platformManagerRouter.post('/daily', async (req, res): Promise<void> => {
    try {
        const { chosenDate } = req.body
        const normalizedDate = new Date(chosenDate)
        normalizedDate.setHours(0, 0, 0, 0)

        const dailyReport =
            await new GenerateDailyReportController()
                .generateDailyReport(normalizedDate)

        res.status(StatusCodes.OK).json(dailyReport)
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: (err as Error).message,
        });
    }
})

/**
 * US-39: As a Platform Manager, I want to generate weekly reports so 
 *        that I can view the weekly statistics of cleaners and services
 */
platformManagerRouter.post('/weekly', async (req, res): Promise<void> => {
    try {
        const { chosenDate } = req.body
        const normalizedDate = new Date(chosenDate)
        normalizedDate.setHours(0, 0, 0, 0)

        const weeklyReport =
            await new GenerateWeeklyReportController()
                .generateWeeklyReport(normalizedDate)

        res.status(StatusCodes.OK).json(weeklyReport)
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: (err as Error).message,
        });
    }
})

/**
 * US-40: As a Platform Manager, I want to generate monthly reports so 
 *        that I can view the monthly statistics of cleaners and services
 */
platformManagerRouter.post('/monthly', async (req, res): Promise<void> => {
    try {
        const { chosenDate } = req.body
        const normalizedDate = new Date(chosenDate)
        normalizedDate.setHours(0, 0, 0, 0)

        const monthlyReport =
            await new GenerateMonthlyReportController()
                .generateMonthlyReport(normalizedDate)

        res.status(StatusCodes.OK).json(monthlyReport)
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: (err as Error).message,
        });
    }
})

export default platformManagerRouter
