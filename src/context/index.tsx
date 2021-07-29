import React from 'react'
import { AuthProvider } from './AuthContext'


export function AppProvider ({ children })  {

    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    )
}

