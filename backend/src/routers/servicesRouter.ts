import {
    CreateServiceController,
    CreateServiceProvidedController,
    ViewServicesProvidedController
} from "../controllers/serviceControllers"
import { UserAccountResponse } from "../dto/userDTOs"
import { StatusCodes } from "http-status-codes"
import { Router } from "express"
import { requireAuthMiddleware } from "../shared/middleware"

const servicesRouter = Router()

declare module 'express-session' {
    interface SessionData {
        user: UserAccountResponse
    }
}

/**
 * Create new service 'category' or 'type'
 */
servicesRouter.post('/', async (req, res): Promise<void> => {
    try {
        await new CreateServiceController().createService(req.body.service)
        res.status(StatusCodes.CREATED).send()
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: (err as Error).message
        })
    }
})

/**
 * Get all the services 'categories' or 'types' that exist
 */
servicesRouter.get('/', async (req, res): Promise<void> => {
    try {
        res.status(StatusCodes.IM_A_TEAPOT).json({
            message: "API Endpoint to be implemented"
        })
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: (err as Error).message
        })
    }
})

/**
 * Gets all the service 'types' provided by a cleaner (by their userID)
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

/**
 * Cleaners can add the types of services they provide
 */
servicesRouter.post(
    '/me', requireAuthMiddleware,
    async (req, res): Promise<void> => {
        try {
            if (!req.session.user) {
                /**
                 * Shouldn't reach here, as the 'requireAuthMiddleware' 
                 * should ensure the user object is valid
                 * 
                 * Just asserting that it isn't null to stop the 
                 * Typescript compiler from complaining (zzzzz)
                 */
                throw new Error("This isn't (theoretically) possible")
            }

            const { service } = req.body
            await new CreateServiceProvidedController().createServiceProvided(req.session.user?.id, service)
            res.status(StatusCodes.CREATED).send()
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
servicesRouter.delete('/me', async (req, res): Promise<void> => {
    try {
        // TODO
        const { service } = req.body
        res.status(StatusCodes.IM_A_TEAPOT).json({
            message: 'API Endpoint to be implemented'
        })
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: (err as Error).message
        })
    }
})

export default servicesRouter