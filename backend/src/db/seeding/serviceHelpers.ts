import { UserAccountsSelect } from '../schema/userAccounts'
import { DrizzleClient } from '../../shared/constants'
import { faker } from '@faker-js/faker'
import {
    ServiceCategoriesSelect,
    serviceCategoriesTable
} from '../schema/serviceCategories'
import {
    ServicesProvidedInsert,
    ServicesProvidedSelect,
    servicesProvidedTable
} from '../schema/servicesProvided'

export const initServiceCategories = async (
    db: DrizzleClient,
    serviceCategories: string[]
): Promise<ServiceCategoriesSelect[]> => {

    return await db
        .insert(serviceCategoriesTable)
        .values(serviceCategories.map(sc => {
            return { label: sc }
        }))
        .returning()
}

export const initServicesProvided = async (
    db: DrizzleClient,
    allCleaners: UserAccountsSelect[],
    allServiceCategories: ServiceCategoriesSelect[],
    allServiceNames: string[]
): Promise<ServicesProvidedSelect[]> => {

    const servicesProvidedToAdd: ServicesProvidedInsert[] = []
    for (const cleaner of allCleaners) {
        const randomServiceCategories = faker.helpers.arrayElements(
            allServiceCategories,
            { min: 0, max: allServiceCategories.length }
        )

        randomServiceCategories.forEach(sc => {
            servicesProvidedToAdd.push({
                cleanerID: cleaner.id as number,
                serviceCategoryID: sc.id as number,
                serviceName: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                price: faker.number
                    .float({
                        min: 20,
                        max: 400,
                        fractionDigits: 2
                    })
                    .toString()
            } as ServicesProvidedInsert)
        })
    }

    if (servicesProvidedToAdd.length === 0) {
        return []
    }

    return await db
        .insert(servicesProvidedTable)
        .values(servicesProvidedToAdd)
        .onConflictDoNothing()
        .returning()
}

