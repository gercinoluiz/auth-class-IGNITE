import { Button, Center, Flex, Input, Text } from '@chakra-ui/react'
import Head from 'next/head'
import Image from 'next/image'
import React, { FormEvent, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { withSSRAuth } from '../uitls/withSSRAuth'

import { api } from '../services/apiClient';
import { useEffect } from 'react'
import { setupAPIClient } from '../services/api'
import { usePermitions } from '../hooks/usePermitions'
import Can from '../components/Can'

export default function DashBoard() {

    const { user } = useAuth()


    useEffect(() => {
        api.get('/me').then(response => console.log(response))
    }, [])

    return (
        <Center w='100vw' h='100vh'>



            <Text>Metricas</Text>


        </Center>

    )
}


export const getServerSideProps = withSSRAuth(async (ctx) => {

    const apiClient = setupAPIClient(ctx)

    const response = await apiClient.get('/me')



    return {
        props: {

        }
    }
}, {
    permitions: ['metrics.list'],
    roles: ['administrador']
})