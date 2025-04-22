import {
    CreateNewUserProfileController,
    UpdateUserProfileController,
    ViewUserProfilesController
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
        const profileCreated = await controller.createNewUserProfile(profileName)
        if (!profileCreated) {
            throw new Error("Unable to create profile '" + profileName + "'")
        }
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
        const profiles =
            await new ViewUserProfilesController().viewUserProfiles()
        res.status(StatusCodes.OK).json(profiles)
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: (err as Error).message
        })
    }
})

userProfilesRouter.put('/update', async (req, res): Promise<void> => {
    try {
        const { oldProfileName, newProfileName } = req.body
        const update =
            await new UpdateUserProfileController().updateUserProfile(
                oldProfileName,
                newProfileName
            )
        res.status(StatusCodes.OK).json({ message: 'Update Success' })
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: (err as Error).message
        })
    }
})
export default userProfilesRouter
