import { useState } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { Stepper, Button, Group, TextInput, NumberInput, Modal, Center, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import { isAddress, parseUnits } from 'ethers/lib/utils'
import { Web3Button } from '@thirdweb-dev/react'

import { useMarketplaceContractWrite } from '@/hooks/useMarketplaceContract'
import { NftRenderer } from './NftRenderer'
import { abi } from '../artifacts/Marketplace.json'
import { notifications } from '@mantine/notifications'
import { IconConfetti } from '@tabler/icons-react'

export function ListItemForm () {
  const [active, setActive] = useState(0)
  const [opened, { open, close }] = useDisclosure(false)

  const { mutateAsync } = useMarketplaceContractWrite('listItem')

  const form = useForm({
    initialValues: {
      nftAddress: '',
      tokenId: '',
      price: 0,
      nftFetchingState: {}
    },

    validate: (values) => {
      if (active === 0) {
        return {
          nftAddress:
            !isAddress(values.nftAddress.trim())
              ? 'Invalid address'
              : null,
          tokenId:
            typeof values.tokenId !== 'number' || values.tokenId < 0
              ? 'Invalid token id'
              : null
        }
      }

      if (active === 1) {
        return {
          price: values.price <= 0 ? 'Price must be greater than 0' : null
        }
      }

      return {}
    }
  })

  const nextStep = () =>
    setActive((current) => {
      return current < 2 ? current + 1 : current
    })

  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current))

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => {
          close()
          setActive(0)
          form.reset()
        }}
        title='List Item'
        centered
        closeOnClickOutside={false}
      >
        <Stepper active={active} breakpoint='sm'>
          <Stepper.Step label='First step' description='Enter NFT to list'>
            <TextInput
              label='ERC721 Contract Address'
              placeholder='contract address'
              required
              minLength={1}
              {...form.getInputProps('nftAddress')}
            />
            <NumberInput
              mt='md'
              label='Token Id'
              placeholder='token id'
              required
              min={0}
              precision={0}
              {...form.getInputProps('tokenId')}
            />
          </Stepper.Step>

          <Stepper.Step label='Second step' description='Set a price'>
            <NftRenderer
              setFieldValue={form.setFieldValue}
              {...form.values}
            />
            <NumberInput
              mt='md'
              label='Price'
              placeholder='100'
              required
              min={0}
              precision={3}
              formatter={(value) =>
                !Number.isNaN(parseFloat(value))
                  ? `${value} MATIC`
                  : '0 MATIC'}
              {...form.getInputProps('price')}
            />
          </Stepper.Step>

          <Stepper.Completed>
            <Center h={150} m='md'>
              <IconConfetti
                size='md'
              />
            </Center>
            <Center>
              <Text size='xl'>Item Listed!</Text>
            </Center>
          </Stepper.Completed>
        </Stepper>

        <Group position='right' mt='xl'>
          {active === 1 && (
            <Button variant='default' onClick={prevStep}>
              Back
            </Button>
          )}
          {active !== 2 && (
            // <Button onClick={nextStep}>Next step</Button>
            <Web3Button
              contractAddress={process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS}
              contractAbi={abi}
              action={async () => {
                if (form.validate().hasErrors) {
                  return
                }
                if (active === 1) {
                  const { price, nftAddress, tokenId, nftFetchingState: { getApproval } } = form.values

                  await getApproval({
                    args: [process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS, tokenId]
                  })

                  await mutateAsync({
                    args: [parseUnits(String(price)), nftAddress, tokenId]
                  }, {
                    data: (...params) => {
                      console.log('data post mutateAsync listItem', ...params)
                    }
                  })
                }
                nextStep()
              }}
              isDisabled={active === 1 && !form.values.nftFetchingState?.nft}
              onError={(e) => {
                notifications.show({
                  title: 'Failed to list item!☹️',
                  message: e.reason,
                  color: 'red'
                })
              }}
              style={{
                background: (active === 1 && !form.values.nftFetchingState?.nft)
                  ? '#373A40' // disabled color
                  : '#1971c2',
                color: 'white'
              }}
            >
              {active === 1 ? 'List NFT' : 'Next'}
            </Web3Button>
          )}
        </Group>
      </Modal>

      <Group position='center'>
        <Button onClick={open}>List NFT</Button>
      </Group>
    </>
  )
}
