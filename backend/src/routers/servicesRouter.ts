import {
    allowedProfilesMiddleware, requireAuthMiddleware
} from "../shared/middleware"
import { CreateServiceController, CreateServiceProvidedController, ViewServicesProvidedController } from "../controllers/serviceControllers"
import { UserAccountResponse } from "../dto/userDTOs"
import { StatusCodes } from "http-status-codes"
import { Router } from "express"

const servicesRouter = Router()

servicesRouter.use(requireAuthMiddleware)

/**
 * Create new service type (user admins)
 */
servicesRouter.post(
    '/', allowedProfilesMiddleware(['user admin']),
    async (req, res): Promise<void> => {
        try {
            await new CreateServiceController()
                .createService(req.body.service)
            res.status(StatusCodes.CREATED)
        } catch (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: (err as Error).message
            })
        }
    }
)

/**
 * Gets all the services provided by a cleaner (by their userID)
 */
servicesRouter.get('/:id', async (req, res): Promise<void> => {
    try {
        const { id } = req.params
        const serviceCategoriesOffered =
            await new ViewServicesProvidedController()
                .viewServicesProvided(Number(id))

        res.status(StatusCodes.OK).json(serviceCategoriesOffered)
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: (err as Error).message
        })
    }
})

declare module 'express-session' {
    interface SessionData {
        user: UserAccountResponse
    }
}

/**
 * Creates a new service provided by a cleaner
 */
servicesRouter.post(
    '/', allowedProfilesMiddleware(['cleaner']),
    async (req, res): Promise<void> => {
        try {
            if (!req.session.user) {
                res.status(StatusCodes.GONE).json({
                    message: "Authentication Required",
                })
                return
            }

            const userID = Number(req.session.user.id)
            console.log("Le user ID: ", userID)

            await new CreateServiceProvidedController()
                .createServiceProvided(
                    userID,
                    req.body.service
                )
            res.status(StatusCodes.OK).send()
        } catch (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: (err as Error).message
            })
        }
    }
)

/**
 * Cleaners can remove the types of services they provide
 */
servicesRouter.delete(
    '/', allowedProfilesMiddleware(['cleaner']),
    async (req, res): Promise<void> => { }
)

/**
 * Get all the services 'categories' or 'types' that exist
 */
servicesRouter.get('/', async (req, res): Promise<void> => {
    // TODO: Get all services
})

/**
 * Create a new kind of service
 */

export default servicesRouter