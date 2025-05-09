import { StatusCodes } from 'http-status-codes'
import {
    CreateNewUserProfileController,
    SuspendUserProfileController,
    UpdateUserProfileController,
    SearchUserProfileController,
    ViewUserProfilesController
} from '../controllers/userAdminControllers'
import { Router } from 'express'

const userProfilesRouter = Router()

/**
 * US-8: As a user admin, I want to create new user 
 *       profiles so that I can map them to user accounts
 */
userProfilesRouter.post('/', async (req, res): Promise<void> => {
    try {
        const { profileName } = req.body
        const profileCreated =
            await new CreateNewUserProfileController().createNewUserProfile(profileName)
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
 * US-9: As a user admin, I want to view user profiles 
 *       so that I can access profile information
 */
userProfilesRouter.get('/', async (_, res): Promise<void> => {
    const userProfiles = await new ViewUserProfilesController().viewUserProfiles()
    res.status(StatusCodes.OK).json(userProfiles)
})

/**
 * US-10: As a user admin, I want to update user profiles 
 *        so that I can keep profile information up to date
 */
userProfilesRouter.put('/update', async (req, res): Promise<void> => {
    try {
        const { oldProfileName, newProfileName } = req.body
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

/**
 * US-11: As a user admin, I want to suspend user profiles 
 *        so that I can restrict user access if necessary
 */
userProfilesRouter.post('/suspend', async (req, res): Promise<void> => {
    try {
        const { profileName } = req.body
        await new SuspendUserProfileController().suspendUserProfile(profileName)
        res.status(StatusCodes.OK).json({ message: 'UserProfile suspended' })
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: (err as Error).message
        })
    }
})

/**
 * TODO: Remove for final submission (??)
 */
userProfilesRouter.post('/unsuspend', async (req, res): Promise<void> => {
    try {
        const { profileName } = req.body;
        await new SuspendUserProfileController().unsuspendProfile(profileName);
        res.status(StatusCodes.OK).json({ message: 'UserProfile unsuspended' });
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: (err as Error).message
        });
    }
});

/**
 * US-12: As a user admin, I want to search for user profiles 
 *        so that I can find specific user profiles
 */
userProfilesRouter.get('/search', async (req, res): Promise<void> => {
    try {
        const search = req.query.search as string | undefined
        if (!search) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Search query is required'
            })
            return
        }
        const data = await new SearchUserProfileController().searchUserProfiles(search)
        res.status(StatusCodes.OK).json(data)
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: (err as Error).message
        })
    }
})

export default userProfilesRouter
