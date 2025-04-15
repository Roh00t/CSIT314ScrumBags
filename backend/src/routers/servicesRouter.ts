import { requireAuthMiddleware } from "../shared/middleware"
import { UserAccountResponse } from "../dto/dataClasses"
import { StatusCodes } from "http-status-codes"
import {
    CreateServiceController,
    CreateServiceProvidedController,
    ViewServicesController,
    ViewServicesProvidedController
} from "../controllers/serviceControllers"
import { Router } from "express"

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
 * View all the services 'categories' or 'types' that exist
 */
servicesRouter.get('/', async (_, res): Promise<void> => {
    try {
        const allServices = await new ViewServicesController().viewServices()
        res.status(StatusCodes.OK).json(allServices)
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
        const servicesProvided =
            await new ViewServicesProvidedController().viewServicesProvided(Number(id))

        res.status(StatusCodes.OK).json(servicesProvided)
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

            const { service, description, price } = req.body
            await new CreateServiceProvidedController()
                .createServiceProvided(
                    req.session.user?.id,
                    service,
                    description,
                    Number(price)
                )
            res.status(StatusCodes.CREATED).send()
        } catch (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: (err as Error).message
            })
        }
    }
)

export default servicesRouter