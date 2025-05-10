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
    ViewNumberOfInterestedHomeownersController,
    ViewAllServicesProvidedController,
    SearchServicesProvidedController,
    CreateServiceProvidedController,
    UpdateServiceProvidedController,
    DeleteServiceProvidedController,
    ViewServicesProvidedController
} from '../controllers/cleanerControllers'
import { Router } from 'express'

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
    const { category } = req.body

    const createSuccess =
        await new CreateServiceCategoryController()
            .createServiceCategory(category)

    // Return (TRUE | FALSE) to the boundary, depending on service category create success
    if (createSuccess) {
        res.status(StatusCodes.CREATED).json(true) // Normal flow
    } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(false) // Alternate flow
    }
})

/**
 * US-34: As a Platform Manager, I want to view current service 
 *        categories to see the current services provided
 * 
 * View all service 'categories' that exist
 */
servicesRouter.get('/categories', async (_, res): Promise<void> => {
    const allServiceCategories =
        await new ViewServiceCategoriesController()
            .viewServiceCategories()

    res.status(StatusCodes.OK).json(allServiceCategories)
})

/**
 * US-35: As a Platform Manager, I want to update service categories 
 *        so that I can keep the available services accurate and up to date
 */
servicesRouter.put('/categories', async (req, res): Promise<void> => {
    const { category, newCategory } = req.body
    const updateSuccess =
        await new UpdateServiceCategoryController()
            .updateServiceCategory(category, newCategory)

    // Return (TRUE | FALSE) to the boundary, depending on service category update success 
    if (updateSuccess) {
        res.status(StatusCodes.OK).send(true) // Normal flow
    } else {
        res.status(StatusCodes.OK).json(false) // Alternate flow
    }
})

/**
 * US-36: As a Platform Manager, I want to delete service 
 *        categories to remove services no longer provided 
 */
servicesRouter.delete('/categories', async (req, res): Promise<void> => {
    const { category } = req.body

    const deleteSuccess =
        await new DeleteServiceCategoryController()
            .deleteServiceCategory(category)

    // Return (TRUE | FALSE) to the boundary, depending on service category deletion success
    if (deleteSuccess) {
        res.status(StatusCodes.OK).send(true) // Normal flow
    } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(false) // Alternate flow
    }
})

/**
 * US-37: As a Platform Manager, I want to search service categories so 
 *        that I can quickly find and manage specific types of services 
 */
servicesRouter.get('/categories/search', async (req, res): Promise<void> => {
    const search = req.query.search as string

    const searchedcategory =
        await new SearchServiceCategoryController()
            .searchServiceCategory(search)

    res.status(StatusCodes.OK).json(searchedcategory)
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
 * US-13: As a cleaner, I want to create my service so 
 *        that homeowners can view my services provided 
 */
servicesRouter.post(
    '/me',
    requireAuthMiddleware,
    async (req, res): Promise<void> => {
        if (!req.session.user) {
            /**
             * Shouldn't reach here, as the 'requireAuthMiddleware'
             * should ensure the user object is valid
             *
             * Just asserting that it isn't null to stop the
             * Typescript compiler from complaining (zzzzz)
             */
            // throw new Error("This isn't (theoretically) possible")
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(false)
            return
        }

        const { service, category, description, price } = req.body
        const createSuccess = await new CreateServiceProvidedController()
            .createServiceProvided(
                req.session.user?.id,
                service,
                category,
                description,
                Number(price)
            )

        // Return (TRUE | FALSE) to the boundary, depending on service creation success
        if (createSuccess) {
            res.status(StatusCodes.CREATED).json(true) // Normal flow
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(false) // Alternate flow
        }
    }
)

/**
 * US-20: As a cleaner, I want to view the number of homeowners interested in 
 *        my services, so that I can understand the demand of my services
 */
servicesRouter.get(
    '/views',
    async (req, res): Promise<void> => {
        const { serviceProvidedID } = req.body

        const noOfInterestedHomeowners =
            await new ViewNumberOfInterestedHomeownersController()
                .viewNumberOfInterestedHomeowners(serviceProvidedID)

        res.status(StatusCodes.OK).json(noOfInterestedHomeowners)
    }
)

/**
 * US-15: As a cleaner, I want to update my service so  
 *        that I can make changes to my service provided.
 */
servicesRouter.put(
    '/',
    requireAuthMiddleware,
    async (req, res): Promise<void> => {
        const { serviceid, service, description, price } = req.body

        const updateSuccess =
            await new UpdateServiceProvidedController()
                .updateServiceProvided(serviceid, service, description, price)

        // Return (TRUE | FALSE) to the boundary, depending on whether update succeeded
        if (updateSuccess) {
            res.status(StatusCodes.OK).json(true) // Normal flow
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(false) // Alternate flow
        }
    }
)

/**
 * US-16: As a cleaner, I want to delete my service 
 *        so that I can remove my service provided
 */
servicesRouter.delete(
    '/',
    requireAuthMiddleware,
    async (req, res): Promise<void> => {
        const { serviceid } = req.body

        const deletedSuccessfully =
            await new DeleteServiceProvidedController()
                .deleteServiceProvided(serviceid)

        // Return (TRUE | FALSE) to the boundary, depending on whether deletion succeeded
        if (deletedSuccessfully) {
            res.status(StatusCodes.OK).json(true) // Normal flow
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(false) // Alternate flow
        }
    }
)

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
    const { id } = req.params
    const { serviceName } = req.body

    //==== US-17 =====
    if (serviceName && String(serviceName).length > 0) {
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
})

export default servicesRouter
