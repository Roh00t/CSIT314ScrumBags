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
    const { profileName } = req.body

    const createSuccess =
        await new CreateNewUserProfileController()
            .createNewUserProfile(profileName)

    // Return (TRUE | FALSE) depending on whether the profile was created successfully
    if (createSuccess) {
        res.status(StatusCodes.CREATED).json(true) // Normal flow
    } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(false) // Alternate flow
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
    const { oldProfileName, newProfileName } = req.body
    const updateSuccess = await new UpdateUserProfileController().updateUserProfile(
        oldProfileName,
        newProfileName
    )

    // Return (TRUE | FALSE) to the boundary - depending on whether update succeeded
    if (updateSuccess) {
        res.status(StatusCodes.OK).json(true)
    } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(false)
    }
})

/**
 * US-11: As a user admin, I want to suspend user profiles 
 *        so that I can restrict user access if necessary
 */
userProfilesRouter.post('/suspend', async (req, res): Promise<void> => {
    const { profileName } = req.body

    const suspensionSuccess =
        await new SuspendUserProfileController()
            .suspendUserProfile(profileName)

    // Return (TRUE | FALSE) to the boundary - depending on whether suspension succeeded
    if (suspensionSuccess) {
        res.status(StatusCodes.OK).json(true)
    } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(false)
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
    const search = req.query.search as string
    const userProfile = await new SearchUserProfileController().searchUserProfiles(search)

    if (userProfile !== null) {
        res.status(StatusCodes.OK).json(userProfile) // Normal flow
    } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(null) // Alternate flow
    }
})

export default userProfilesRouter
