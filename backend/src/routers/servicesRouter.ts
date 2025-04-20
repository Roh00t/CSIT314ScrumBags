import { requireAuthMiddleware } from '../shared/middleware'
import { UserAccountData } from '../shared/dataClasses'
import { StatusCodes } from 'http-status-codes'
import {
    CreateServiceCategoryController,
    CreateServiceController,
    CreateServiceProvidedController,
    ViewServiceCategoriesController,
    ViewServicesController,
    ViewServicesProvidedController
} from '../controllers/serviceControllers'
import { Router } from 'express'
import { ServiceCategoryNotFound } from '../shared/exceptions'

const servicesRouter = Router()

declare module 'express-session' {
    interface SessionData {
        user: UserAccountData
    }
}

/**
 * Create new service 'categories'
 */
servicesRouter.post('/categories', async (req, res): Promise<void> => {
    try {
        const { category } = req.body
        await new CreateServiceCategoryController().createServiceCategory(category)
        res.status(StatusCodes.OK).send()
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: (err as Error).message
        })
    }
})

/**
 * View all service 'categories' that exist
 */
servicesRouter.get('/categories', async (_, res): Promise<void> => {
    try {
        const allServiceCategories =
            await new ViewServiceCategoriesController()
                .viewServiceCategories()
        res.status(StatusCodes.OK).json(allServiceCategories)
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: (err as Error).message
        })
    }
})

/**
 * Create new service, with a certain 'category' or 'type'
 */
servicesRouter.post('/', async (req, res): Promise<void> => {
    try {
        const { service, category } = req.body
        await new CreateServiceController().createService(service, category)
        res.status(StatusCodes.CREATED).send()
    } catch (err) {
        if (err instanceof ServiceCategoryNotFound) {
            res.status(StatusCodes.NOT_FOUND).json({
                message: (err as Error).message
            })
        }
        else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: (err as Error).message
            })
        }
    }
})

/**
 * View all the services that exist, as well as their corresponding 'category'
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
            await new ViewServicesProvidedController().viewServicesProvided(
                Number(id)
            )

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
    '/me',
    requireAuthMiddleware,
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
            await new CreateServiceProvidedController().createServiceProvided(
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
