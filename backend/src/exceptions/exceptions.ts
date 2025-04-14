export class UserAccountNotFound extends Error {
    constructor(message: string) {
        super(message)
    }
}

export class InvalidCredentialsError extends Error {
    constructor(message: string) {
        super(message)
    }
}

export class UserAccountSuspendedError extends Error {
    constructor(message: string) {
        super(message)
    }
}

export class ServiceNotFoundError extends Error {
    constructor(message: string) {
        super(message)
    }
}

// export class InvalidRoleError extends Error {
//     constructor(message: string) {
//         super(message)
//     }
// }
