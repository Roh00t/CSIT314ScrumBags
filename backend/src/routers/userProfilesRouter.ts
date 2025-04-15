
import {
    CreateNewUserProfileController, ViewUserProfilesController
} from '../controllers/userProfileControllers'
import { StatusCodes } from 'http-status-codes'
import { Router } from 'express'

const userProfilesRouter = Router()

/**
 * Create user profile
 */
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

/**
 * Get all user profiles
 */
userProfilesRouter.get('/', async (_, res): Promise<void> => {
    try {
        const profiles = await new ViewUserProfilesController().viewUserProfiles()
        res.status(StatusCodes.OK).json(profiles)
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: (err as Error).message
        })
    }
})

export default userProfilesRouter
