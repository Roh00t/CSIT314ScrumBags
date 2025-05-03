import { requireAuthMiddleware } from '../shared/middleware'
import { UserAccountData } from '../shared/dataClasses'
import {
    CreateServiceCategoryController,
    DeleteServiceCategoryController,
    SearchServiceCategoryController,
    UpdateServiceCategoryController,
    ViewServiceCategoriesController,
} from '../controllers/platformManagerControllers'
import { StatusCodes } from 'http-status-codes'
import {
    ViewAllServicesProvidedController,
    SearchServicesProvidedController,
    CreateServiceProvidedController,
    ViewServicesProvidedController,
    ViewNumberOfInterestedHomeownersController,
    UpdateNumberOfInterestedHomeownersController,
    UpdateServiceProvidedController,
    DeleteServiceProvidedController
} from '../controllers/cleanerControllers'
import { Router } from 'express'
import {
    ServiceCategoryAlreadyExistsError,
    ServiceCategoryNotFoundError
} from '../shared/exceptions'

const servicesRouter = Router()

declare module 'express-session' {
    interface SessionData {
        user: UserAccountData
    }
}

/**
 * US-33: As a Platform Manager, I want to create service categories, 
 *        to display more services which fit the requirements of our customers
 */
servicesRouter.post('/categories', async (req, res): Promise<void> => {
    try {
        const { category } = req.body
        await new CreateServiceCategoryController().createServiceCategory(category)
        res.status(StatusCodes.CREATED).send()
    } catch (err) {
        if (err instanceof ServiceCategoryAlreadyExistsError) {
            res.status(StatusCodes.CONFLICT).json({
                message: (err as Error).message
            })
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: (err as Error).message
            })
        }
    }
})

/**
 * US-34: As a Platform Manager, I want to view current service 
 *        categories to see the current services provided
 * 
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
 * US-35: As a Platform Manager, I want to update service categories 
 *        so that I can keep the available services accurate and up to date
 */
servicesRouter.put('/categories', async (req, res): Promise<void> => {
    try {
        const { category, newCategory } = req.body
        await new UpdateServiceCategoryController().updateServiceCategory(
            category, newCategory
        )
        res.status(StatusCodes.OK).send()
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: (err as Error).message
        })
    }
})

/**
 * US-36: As a Platform Manager, I want to delete service 
 *        categories to remove services no longer provided 
 */
servicesRouter.delete('/categories', async (req, res): Promise<void> => {
    try {
        const { category } = req.body
        await new DeleteServiceCategoryController().deleteServiceCategory(category)
        res.status(StatusCodes.OK).send()
    } catch (err) {
        if (err instanceof ServiceCategoryNotFoundError) {
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
 * US-37: As a Platform Manager, I want to search service categories so 
 *        that I can quickly find and manage specific types of services 
 */
servicesRouter.get('/categories/search', async (req, res): Promise<void> => {
    try {
        const search = req.query.search as string | undefined
        if (!search) {
            res.status(StatusCodes.BAD_REQUEST)
                .json({ message: 'Search query is required' })
            return
        }
        const searchedcategory =
            await new SearchServiceCategoryController()
                .searchServiceCategory(search)

        res.status(StatusCodes.OK).json(searchedcategory)
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: (err as Error).message
        })
    }
})

/**
 * TODO: What user story is this??
 * 
 * Gets all the services
 */
servicesRouter.get('/', async (_, res): Promise<void> => {
    try {
        const allServices =
            await new ViewAllServicesProvidedController()
                .viewAllServicesProvided()

        res.status(StatusCodes.OK).json(allServices)
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: (err as Error).message
        })
    }
})

/**
 * US-14: As a cleaner, I want to view my service 
 *        so that I can check on my services provided
 * 
 * US-17: As a cleaner, I want to search my service so 
 *        that I can look up a specific service I provide
 * 
 * Gets all the service 'types' provided by a cleaner (by their userID).
 * 
 * Conditionally checks the "serviceName" field within request body. 
 * If it exists, it will invoke the controller to search services provided
 */
servicesRouter.post('/:id', async (req, res): Promise<void> => {
    try {
        const { id } = req.params
        const { serviceName } = req.body

        if (serviceName && String(serviceName).length > 0) { //==== US-17 =====
            const servicesProvided =
                await new SearchServicesProvidedController()
                    .searchServicesProvided(Number(id), serviceName)

            res.status(StatusCodes.OK).json(servicesProvided)
        } else { //========== US-14 =======
            const servicesProvided =
                await new ViewServicesProvidedController()
                    .viewServicesProvided(Number(id))

            res.status(StatusCodes.OK).json(servicesProvided)
        }
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: (err as Error).message
        })
    }
})

/**
 * US-13: As a cleaner, I want to create my service so 
 *        that homeowners can view my services provided 
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

            const { service, category, description, price } = req.body
            await new CreateServiceProvidedController().createServiceProvided(
                req.session.user?.id,
                service,
                category,
                description,
                Number(price)
            )
            res.status(StatusCodes.CREATED).send()
        } catch (err) {
            if (err instanceof ServiceCategoryNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    message: (err as Error).message
                })
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: (err as Error).message
                })
            }
        }
    }
)

/**
 * US-20 (a): As a cleaner, I want to view the number of homeowners interested in 
 *            my services, so that I can understand the demand of my services
 */
servicesRouter.get(
    '/views',
    requireAuthMiddleware,
    async (req, res): Promise<void> => {
        try {
            const cleanerID = (req.session.user as UserAccountData).id

            const noOfInterestedHomeowners =
                await new ViewNumberOfInterestedHomeownersController()
                    .viewNumberOfInterestedHomeowners(cleanerID)

            res.status(StatusCodes.OK).json(noOfInterestedHomeowners)
        } catch (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: (err as Error).message
            })
        }
    }
)

/**
 * US-20 (b): As a cleaner, I want to view the number of homeowners interested in 
 *            my services, so that I can understand the demand of my services
 */
servicesRouter.post(
    '/views',
    requireAuthMiddleware,
    async (req, res): Promise<void> => {
        try {
            const homeownerID = (req.session.user as UserAccountData).id
            const { serviceProvidedID } = req.body

            await new UpdateNumberOfInterestedHomeownersController()
                .updateNumberOfInterestedHomeowners(
                    homeownerID,
                    serviceProvidedID,
                    new Date()
                )
        } catch (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: (err as Error).message
            })
        }
    }
)
/**
 * US-15: As a cleaner, I want to update my service so  
 *        that I can make changes to my service provided.
 */
servicesRouter.put(
    '/',
    requireAuthMiddleware,
    async (req, res): Promise<void> =>{
        try{
            //Should I place Line 206-213 here
            const { serviceid, service, description, price } = req.body
            await new UpdateServiceProvidedController().updateServiceProvided(serviceid, service, description, price)
            res.status(StatusCodes.OK).send()
        } catch (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: (err as Error).message
            })
        }
        
    }
)

/**
 * US-16: As a cleaner, I want to delete my service 
 * so that I can remove my service provided
 */
servicesRouter.delete(
    '/',
    requireAuthMiddleware,
    async (req, res): Promise<void> =>{
        try{
            const { serviceid } = req.body
            await new DeleteServiceProvidedController().deleteServiceProvided(serviceid)
            res.status(StatusCodes.OK).send()
        } catch (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: (err as Error).message
            })
        }
        
    }
)
export default servicesRouter
