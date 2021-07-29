import { Button, Center, Flex, Input } from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { parseCookies } from 'nookies'
import React, { FormEvent, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { withSSRGuest } from '../uitls/withSSRGuest'


export default function Home() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { signIn } = useAuth()

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    const data = {
      email, password
    }



    await signIn(data)

  }

  return (
    <Center w='100vw' h='100vh'>
      <Flex as='form' onSubmit={handleSubmit} bg='gray.600' flexDir='column' borderRadius='10' justify='center' align='center' w='25rem' h='60'>
        <Input type='email' color='#000' value={email} onChange={e => setEmail(e.target.value)} bg='gray.100' fontSize='22' fontWeight='bold' w='90%' mb='5' placeholder='Email' />
        <Input type='password' bg='gray.100' color='#000' w='90%' fontSize='22' value={password} onChange={e => setPassword(e.target.value)} fontWeight='bold' mb='5' placeholder='Senha' />
        <Button type='submit' bg='pink.400' w='90%' color='gray.400'> Entrar </Button>
      </Flex>
    </Center>

  )
}




// o CTX abaixo indica o context do server, que contem os cookies e outras coisas

export const getServerSideProps = withSSRGuest( async (ctx) =>{

  // I need always to return props or else it returns an error
  return {
    props:{

    }
  }
})