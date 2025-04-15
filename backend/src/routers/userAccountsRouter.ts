import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { UserAccountResponse } from '../dto/dataClasses'
import {
    CreateNewUserAccountController,
    ViewUserAccountsController,
    LoginController
} from '../controllers/userAccountControllers'
import {
    UserAccountSuspendedError,
    InvalidCredentialsError,
    UserAccountNotFound
} from '../exceptions/exceptions'
import { Router } from 'express'
import { ViewCleanersController } from '../controllers/cleanerControllers'

const userAccountsRouter = Router()

userAccountsRouter.get('/', async (_, res): Promise<void> => {
    try {
        const allUserAccountData = await new ViewUserAccountsController().viewUserAccounts()
        res.status(StatusCodes.OK).json(allUserAccountData)
    }
    catch (err) {
        if (err instanceof UserAccountNotFound) {
            res.status(StatusCodes.NOT_FOUND).json({ message: err.message })
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: ReasonPhrases.INTERNAL_SERVER_ERROR
            })
        }
    }
})

userAccountsRouter.post('/create', async (req, res): Promise<void> => {
    try {
        const { createAs, username, password } = req.body
        const controller = new CreateNewUserAccountController()
        const isCreatedSuccessfully = await controller.createNewUserAccount(
            createAs, username, password
        )

        if (isCreatedSuccessfully) {
            res.status(StatusCodes.CREATED).json({
                message: 'Account created successfully'
            })
        } else {
            res.status(StatusCodes.CONFLICT).json({ message: 'Account creation failed' })
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        })
    }
})

userAccountsRouter.post('/login', async (req, res): Promise<void> => {
    try {
        const { username, password } = req.body
        const controller = new LoginController()
        const userAccRes = await controller.login(username, password)
        req.session.regenerate((err) => {
            if (err) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: 'Express error: ' + err
                })
                return
            }
            (req.session as any).user = userAccRes as UserAccountResponse
            res.status(StatusCodes.OK).json(userAccRes)
        })
    } catch (err) {
        if (err instanceof UserAccountNotFound) {
            res.status(StatusCodes.NOT_FOUND).json({ message: err.message })
        } else if (err instanceof InvalidCredentialsError) {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: err.message })
        } else if (err instanceof UserAccountSuspendedError) {
            res.status(StatusCodes.LOCKED).json({ message: err.message })
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: (err as Error).message
            })
        }
    }
})

userAccountsRouter.post('/logout', async (req, res): Promise<void> => {
    try {
        await req.session.destroy((_) => { })
        res.status(StatusCodes.OK).json({ message: 'Logout successful' })
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: (err as Error).message
        })
    }
})

userAccountsRouter.get('/cleaners', async (req, res): Promise<void> => {
    try{
        const allAvailableCleaners = await new ViewCleanersController().viewCleaners()
        res.status(StatusCodes.OK).json(allAvailableCleaners)
    }
    catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: (err as Error).message

        })
    }
})
export default userAccountsRouter
