import { Router } from 'express'
import { UserAccountData } from '../shared/dataClasses'
import { StatusCodes } from 'http-status-codes'
import { GenerateReportController } from '../controllers/platformManagerController'

const platformManagerRouter = Router()

declare module 'express-session' {
    interface SessionData {
        user: UserAccountData
    }
}

platformManagerRouter.get('/daily', async (req, res): Promise<void> => {
    try {
        const { chosenDate } = req.body
        const myDate = new Date(Date.parse(chosenDate))
        const dailyReport =
            await new GenerateReportController().generateDailyReport(myDate)
        res.status(StatusCodes.OK).json(dailyReport)
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: (err as Error).message
        })
    }
})

platformManagerRouter.post('/daily', async (req, res): Promise<void> => {
    try {
        const { chosenDate } = req.body;
        const myDate = new Date(Date.parse(chosenDate));
        const dailyReport =
            await new GenerateReportController().generateDailyReport(myDate);
        res.status(StatusCodes.OK).json(dailyReport);
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: (err as Error).message,
        });
    }
});


export default platformManagerRouter
