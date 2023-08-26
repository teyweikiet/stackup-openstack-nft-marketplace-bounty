'use client'

import { useAddress } from '@thirdweb-dev/react'
import {
  Header,
  Group,
  Burger,
  rem,
  Avatar,
  Title,
  Drawer,
  MediaQuery,
  Center
} from '@mantine/core'
import { ConnectNetwork } from './ConnectNetwork'
import { ListItemForm } from './ListItemForm'
import { useDisclosure } from '@mantine/hooks'

const HEADER_HEIGHT = rem(60)

export function Navbar () {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false)
  const address = useAddress()

  return (
    <>
      <Header height={HEADER_HEIGHT}>
        <Group position='apart' sx={{ height: '100%' }}>
          <Group>
            <Avatar color='cyan' radius='xl'>K</Avatar>
            <Title
              size='h3'
            >
              kit-t's Marketplace

            </Title>
          </Group>
          <MediaQuery
            largerThan='sm'
            styles={{
              display: 'flex'
            }}
          >
            <Group display='none'>
              <ConnectNetwork />
              {address && (
                <ListItemForm />
              )}
            </Group>
          </MediaQuery>
          <MediaQuery
            largerThan='sm'
            styles={{
              display: 'none'
            }}
          >
            <Group>
              <Burger
                opened={drawerOpened}
                onClick={toggleDrawer}
              />
            </Group>
          </MediaQuery>
        </Group>
      </Header>

      <MediaQuery
        largerThan='sm'
        styles={{
          display: 'none'
        }}
      >
        <Drawer
          opened={drawerOpened}
          onClose={closeDrawer}
          zIndex={1000000}
          position='right'
        >
          <Center m='sm'>
            <ConnectNetwork />
          </Center>
          <Center m='sm'>
            {address && (
              <ListItemForm />
            )}
          </Center>
        </Drawer>
      </MediaQuery>
    </>
  )
}
