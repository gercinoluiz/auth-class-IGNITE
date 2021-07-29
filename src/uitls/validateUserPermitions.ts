
type ValidateUserPermitionsParams = {
    user: User;
    permitions?: string[]
    roles?: string[]

}

export function validateUserPermitions({ user, permitions, roles }: ValidateUserPermitionsParams) {


    if (permitions?.length > 0) {
        const hasAllPermitions = permitions.every(permition => {
            return user.permitions.includes(permition)
        })
        if (!hasAllPermitions) {
            return false
        }
    }

    if (roles?.length > 0) {
        const hasAllroles = roles.some(role => {
            return user.roles.includes(role)
        })
        if (!hasAllroles) {
            return false
        }
    }

    return true

}