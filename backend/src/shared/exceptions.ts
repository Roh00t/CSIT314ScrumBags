export class UserAccountNotFoundError extends Error {
    constructor(username: string) {
        super(`Couldn't find user of username '${username}'`)
    }
}

export class SearchUserAccountNoResultError extends Error {
    constructor(search: string) {
        super(`Couldn't find any user accounts using the search term '${search}'`)
    }
}

export class SearchUserProfileNoResultError extends Error {
    constructor(search: string) {
        super(`Couldn't find any user profiles using the search term '${search}'`)
    }
}

export class UserProfileSuspendedError extends Error {
    constructor(profileName: string) {
        super(`User profile '${profileName}' is suspended`)
    }
}

export class InvalidCredentialsError extends Error {
    constructor(username: string) {
        super(`Invalid credentials entered for user '${username}'`)
    }
}

export class UserAccountSuspendedError extends Error {
    constructor(username: string) {
        super(`User account '${username}' is suspended`)
    }
}

export class ServiceCategoryNotFoundError extends Error {
    constructor(serviceCategory: string) {
        super("Service category'" + serviceCategory + "' doesn't exist")
    }
}

export class CleanerAlreadyShortlistedError extends Error {
    constructor(cleaner: string) {
        super(`You have already shortlisted the cleaner '${cleaner}'`)
    }
}