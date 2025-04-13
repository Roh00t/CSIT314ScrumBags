import {
    CreateNewUserProfileController,
    GetUserProfilesController
} from '../controllers/userControllers'
import { StatusCodes } from 'http-status-codes'
import { Router } from 'express'

const userProfilesRouter = Router()

userProfilesRouter.post('/', async (req, res): Promise<void> => {
    try {
        const { profileName } = req.body
        const controller = new CreateNewUserProfileController()
        await controller.createNewUserProfile(profileName)
        res.status(StatusCodes.CREATED).json({ message: 'Success' })
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: (err as Error).message
        })
    }
})

userProfilesRouter.get('/', async (_, res): Promise<void> => {
    try {
        const profiles = await new GetUserProfilesController().getUserProfiles()
        res.status(StatusCodes.OK).json({
            message: 'Successs',
            data: profiles
        })
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: (err as Error).message
        })
    }
})

export default userProfilesRouter
