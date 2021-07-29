import { useAuth } from "../context/AuthContext"
import { validateUserPermitions } from "../uitls/validateUserPermitions";

type usePermitionsParams = {
    permitions?: string[]
    roles?: string[]
}

export function usePermitions({ permitions, roles }: usePermitionsParams) {

    const { user, isAuthenticated } = useAuth()

    if (!isAuthenticated) {
        return false;
    }

    const userhasValidPermitions = validateUserPermitions({
        permitions, roles, user
    })

    return userhasValidPermitions

}