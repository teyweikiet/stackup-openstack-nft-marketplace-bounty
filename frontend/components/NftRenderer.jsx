import { Center, Skeleton, Text } from '@mantine/core'
import { ThirdwebNftMedia, useContract, useNFT, useContractWrite } from '@thirdweb-dev/react'
import { useEffect } from 'react'

export function NftRenderer ({ nftAddress, tokenId, setFieldValue }) {
  // Connect to NFT contract
  const { contract } = useContract(nftAddress, 'nft-collection')
  // Load the NFT metadata from the contract using a hook
  const nftFetchingState = useNFT(contract, tokenId)

  const { mutateAsync: getApproval } = useContractWrite(contract, 'approve')

  const { data, isLoading, error } = nftFetchingState

  const nft = (!error && data?.metadata?.name !== 'Failed to load NFT metadata')
    ? data
    : null

  useEffect(() => {
    if (typeof setFieldValue === 'function') {
      setFieldValue('nftFetchingState', { getApproval, nft, isLoading })
    }
  }, [setFieldValue, getApproval, nft, isLoading])

  // Render the NFT onto the UI
  return (
    <Center
      h='300px'
    >
      <Skeleton
        height={300}
        width={300}
        visible={isLoading}
      >
        {
          !nft
            ? <Center><Text size='xl'>NFT not found.</Text></Center>
            : <ThirdwebNftMedia metadata={nft.metadata} />
        }
      </Skeleton>
    </Center>
  )
}
