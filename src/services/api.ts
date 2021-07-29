import axios, { AxiosError } from "axios";
import { parseCookies, setCookie } from 'nookies';
import { signOut } from "../context/AuthContext";
import { AuthTokenError } from "./errors/AuthTokenError";

// Variavel cerregada no inicio do App

let isRefreshing = false;
let failedRequestsQueue = [];

export function setupAPIClient(ctx = undefined) {

    let cookies = parseCookies(ctx)


    const api = axios.create({
        baseURL: 'http://localhost:3333',
        headers: {
            Authorization: `Bearer ${cookies['nextauth.token']}`
        }
    })

    // Axios Interceptors - intercept an request or response
    // Two parameters 1- success, 2- Error

    api.interceptors.response.use(response => { return response }, (error: AxiosError) => {

        // Alem disso eu tenho que parar todas as requisicoes; fazer o procedimento abaixo; depois retomar as requisicoes paradas
        // Isso gera uma fila de requisicoes

        if (error.response.status === 401) {
            if (error.request.data?.code === 'token.expired') {

                cookies = parseCookies(ctx)

                const { 'nextauth.refreshToken': refreshToken } = cookies;

                // A linha abaixo tem todas as informacoes que foram enviadas na requisicao que deram erro
                const originalConfig = error.config

                if (!isRefreshing) {

                    isRefreshing = true

                    api.post('/refresh', {
                        refreshToken,
                    }).then(response => {

                        const { token } = response.data

                        // I use undefined due to the first option is for SSR
                        setCookie(ctx, 'nextauth.token', token, {
                            maxAge: 60 * 60 * 24 * 34, // 30 days,
                            path: '/' // info for which paht my cookie has access and the / means global
                        })
                        setCookie(ctx, 'nextauth.refreshToken', response.data.refreshToken, {
                            maxAge: 60 * 60 * 24 * 34, // 30 days,
                            path: '/' // info for which paht my cookie has access and the / means global
                        })
                        // Update the headers
                        api.defaults.headers['Authorization'] = `Bearer ${token}`

                        failedRequestsQueue.forEach(request => request.onSuccess(token))
                        failedRequestsQueue = []


                    }).catch(error => {
                        failedRequestsQueue.forEach(request => request.onFailure(error))
                        failedRequestsQueue = []

                        // esse pprocess. browser diz se o codigo esta sendo executado no browser ou no nextServer
                        if (process.browser) {

                            signOut()


                        }


                    }).finally(() => {
                        isRefreshing = false
                    })

                }

                // Eu uso promisse e resolve e reject pq o axios nao permite async no interceptor

                return new Promise((resolve, reject) => {
                    failedRequestsQueue.push({
                        onSuccess: (token: string) => {
                            originalConfig.headers['Authorization'] = `Bearer ${token}`

                            resolve(api(originalConfig))

                        },

                        onFailure: (error: AxiosError) => {
                            reject(error)
                        },
                    })

                })

            } else {
                if (process.browser) {

                    signOut()
                } else {
                    return Promise.reject(new AuthTokenError())
                }

            }
        }

        // Deixar o axios proseguir com os erros
        return Promise.reject(error)

    })


    return api
}