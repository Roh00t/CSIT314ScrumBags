import { Router } from 'express'
import {
    CreateNewUserAccountController,
    LoginController
} from '../controllers/userControllers'
import { StatusCodes } from 'http-status-codes'
import { UserAccountResponse } from '../dto/userDTOs'
import {
    InvalidCredentialsError,
    UserAccountNotFound,
    UserAccountSuspendedError
} from '../exceptions/userExceptions'

const userAccountsRouter = Router()

userAccountsRouter.post('/create', async (req, res): Promise<void> => {
    const { createAs, username, password } = req.body

    try {
        const controller = new CreateNewUserAccountController()
        const createSuccess = await controller.createNewUserAccount(
            createAs,
            username,
            password
        )

        if (createSuccess) {
            res.status(StatusCodes.CREATED).send('Account created successfully')
        } else {
            console.log('Account creation failed due to conflict.') // Log the reason for failure
            res.status(StatusCodes.CONFLICT).send('Account creation failed')
        }
    } catch (error) {
        console.error('Error during account creation:', error) // Log the error for further insights
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(
            'Internal Server Error'
        )
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
            ;(req.session as any).user = userAccRes as UserAccountResponse
            res.status(StatusCodes.OK).json(userAccRes)
        })
    } catch (err) {
        if (err instanceof UserAccountNotFound) {
            res.status(StatusCodes.NOT_FOUND).send()
        } else if (err instanceof InvalidCredentialsError) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                message: 'Invalid credentials'
            })
        } else if (err instanceof UserAccountSuspendedError) {
            res.status(StatusCodes.LOCKED).json({
                message: 'Account is suspended'
            })
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: (err as Error).message
            })
        }
    }
})

userAccountsRouter.post('/logout', async (req, res): Promise<void> => {
    try {
        await req.session.destroy((_) => {})
        res.status(StatusCodes.OK).json({ message: 'Logout successful' })
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: (err as Error).message
        })
    }
})

export default userAccountsRouter
