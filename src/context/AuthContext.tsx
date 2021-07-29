import React, { useEffect } from 'react'
import { useState } from 'react';
import { useContext } from "react";
import { createContext, ReactNode } from "react";
import { api } from '../services/apiClient';


import Router from 'next/router'

import { destroyCookie, parseCookies, setCookie } from 'nookies'


//Notes:
// 1 - SessionStorage`s duration is only while the browser is open
// 2 - LocalStrorage's suration is only in the Browser
// 3 - Cookie can work with serversiderandering




// O que ta abaixo é o que meu contexto vai ter de métodos
type AuthContextData = {
    signIn(credentials: SignInCredentials): Promise<void>;
    isAuthenticated: boolean;
    user: User
}

const AuthContext = createContext({} as AuthContextData)

type ProviderProps = {
    children: ReactNode
}

let authChanel: BroadcastChannel

function signOut() {
    destroyCookie(undefined, 'nextauth.token')
    destroyCookie(undefined, 'nextauth.refreshToken')

    authChanel.postMessage('signOut')
    Router.push('/')
}



function AuthProvider({ children }: ProviderProps) {


    const [user, setUser] = useState<User>(null)

    useEffect(() => {

        authChanel = new BroadcastChannel('auth')
        authChanel.onmessage = (message) => {

            switch (message.data) {
                case 'signOut':
                    signOut()
                    break;
                default:
                    break;
            }

        }

    }, [])

    const isAuthenticated = !!user;



    const signIn = async ({ email, password }: SignInCredentials) => {



        useEffect(() => {

            const { 'nextauth.token': token } = parseCookies()


            if (token) {
                api.get('/me').then(response => {
                    console.log({ response })
                }).catch(() => {

                })
            }

        }, [])

        try {
            const response = await api.post('sessions', {
                email,
                password
            })

            const { permitions, roles, token, refreshToken } = response.data

            // I use undefined due to the first option is for SSR
            setCookie(undefined, 'nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 30, // 30 days,
                path: '/' // info for which paht my cookie has access and the / means global
            })
            setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
                maxAge: 60 * 60 * 24 * 10, // 10 days,
                path: '/' // info for which paht my cookie has access and the / means global
            })

            setUser({
                email,
                permitions,
                roles
            })

            // Update the headers
            api.defaults.headers['Authorization'] = `Bearer ${token}`

            Router.push('/dashboard')
        } catch (error) {
            console.log({ error })
        }
    }


    return (
        <AuthContext.Provider value={{ isAuthenticated, signIn, user }}>
            {children}
        </AuthContext.Provider>
    )
}


function useAuth() {

    const context = useContext(AuthContext)

    return context

}


export { useAuth, AuthProvider, signOut }