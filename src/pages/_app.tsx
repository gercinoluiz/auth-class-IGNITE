import { ChakraProvider } from '@chakra-ui/react'
import { AppProps } from 'next/app'
import { theme } from '../../styles/theme'
import { AppProvider } from '../context/index'

function MyApp({ Component, pageProps }: AppProps) {


  return (
    <ChakraProvider theme={theme}>
      <AppProvider>

        <Component {...pageProps} />
      </AppProvider>

    </ChakraProvider>
  )


}

export default MyApp
