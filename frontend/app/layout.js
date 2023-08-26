'use client'

import { Inter } from 'next/font/google'
import { ThirdwebProvider } from '@thirdweb-dev/react'
import { Container, MantineProvider } from '@mantine/core'

import { Mumbai } from '@thirdweb-dev/chains'
import { Navbar } from '@/components/Navbar'
import { Notifications } from '@mantine/notifications'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout ({ children }) {
  return (
    <html>
      <head>
        <title>kit-t's Marketplace</title>
        <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width' />
        <meta name='description' content="Submission for StackUp's Openstack NFT Marketplace bounty" />
      </head>
      <ThirdwebProvider
        clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
        activeChain={Mumbai}
      >
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme: 'dark'
          }}
        >
          <body className={inter.className}>
            <Notifications />
            <Container size='65rem' px='s'>
              <Navbar />
              {children}
            </Container>
          </body>
        </MantineProvider>
      </ThirdwebProvider>
    </html>
  )
}
