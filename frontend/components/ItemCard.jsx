import { Web3Button, useAddress } from '@thirdweb-dev/react'
import { Center, Paper, Group, Text, Skeleton } from '@mantine/core'
import { formatEther } from 'ethers/lib/utils'

import { NftRenderer } from './NftRenderer'
import { abi } from '../artifacts/Marketplace.json'
import { useMarketplaceContractRead, useMarketplaceContractWrite } from '@/hooks/useMarketplaceContract'
import { notifications } from '@mantine/notifications'

export function ItemCard ({ id }) {
  const address = useAddress()
  const { data } = useMarketplaceContractRead('listings', [id])
  const { mutateAsync } = useMarketplaceContractWrite('buyItem')

  const { nftAddress, tokenId, price, soldAt, seller, buyer } = data ?? {}

  const isSold = soldAt?.gt(0)
  const isSeller = seller === address
  const isBuyer = soldAt?.gt(0) && buyer === address

  return (
    <Paper
      shadow='md'
      radius='md'
      m='sm'
      py='sm'
      style={{
        overflow: 'clip'
      }}
    >
      <div>
        <NftRenderer
          nftAddress={nftAddress}
          tokenId={tokenId}
        />
      </div>
      <Center
        pt='lg'
        pb='sm'
      >
        <Group>
          <Skeleton visible={!price} width={100}>
            <Text size='md' ta='center'>{`${price && formatEther(price)} MATIC`}</Text>
          </Skeleton>
          <Web3Button
            contractAddress={process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS}
            contractAbi={abi}
            action={async () => {
              await mutateAsync({
                args: [id],
                overrides: {
                  value: price
                }
              }, {
                data: (...params) => {
                  console.log('data in mutateAsync buyItem', ...params)
                }
              })
            }}
            isDisabled={isSold || isSeller}
            onError={(e) => {
              notifications.show({
                title: 'Failed to buy item!☹️',
                message: e.reason,
                color: 'red'
              })
            }}
            style={{
              background: (isSold || isSeller)
                ? '#373A40' // disabled color
                : '#1971c2',
              color: 'white'
            }}
          >
            {
              isBuyer
                ? 'Bought'
                : isSold
                  ? 'Sold'
                  : isSeller
                    ? 'Listed'
                    : 'Buy Now'
}
          </Web3Button>

        </Group>

      </Center>
    </Paper>
  )
}
