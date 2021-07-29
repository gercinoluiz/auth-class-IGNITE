import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { destroyCookie, parseCookies } from "nookies"
import { AuthTokenError } from "../services/errors/AuthTokenError"
import decode from 'jwt-decode'
import { validateUserPermitions } from "./validateUserPermitions"


type WithSSROptions = {
    permitions?: string[];
    roles?: string[];
}

export function withSSRAuth<P>(fn: GetServerSideProps<P>, options?: WithSSROptions) {


    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
        const cookies = parseCookies()

        const token = cookies['nextauth.token']

        // it an way of redirecting an user throguh serversideprops in next => return redirect
        if (!token) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false
                }
            }
        }
        if (options) {


            const user = decode<{ permitions: string[], roles: string[] }>(token)
            const { permitions, roles } = options

            const userhasValidPermitions = validateUserPermitions({
                permitions, roles, user
            })

            if (!userhasValidPermitions) {
                return {
                    redirect: {
                        destination: '/dashboard',
                        permanent: false
                    }
                }
            }
        }

        try {
            return await fn(ctx)

        } catch (error) {

            if (error instanceof AuthTokenError) {
                destroyCookie(ctx, 'nextauth.token')
                destroyCookie(ctx, 'nextauth.refreshToken')

                return {
                    redirect: {
                        destination: '/',
                        permanent: false
                    }
                }
            }

        }


    }


}