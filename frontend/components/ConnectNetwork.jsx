import { useEffect } from 'react'
import {
  useNetworkMismatch,
  ConnectWallet,
  useAddress,
  useSwitchChain
} from '@thirdweb-dev/react'
import { Mumbai } from '@thirdweb-dev/chains'

export const ConnectNetwork = () => {
  // Get connected wallet address
  const address = useAddress()
  // Switch to desired chain
  const switchChain = useSwitchChain()
  // Detect if user is connected to the wrong network
  const isMismatched = useNetworkMismatch()

  useEffect(() => {
    // Check if the user is connected to the wrong network
    if (isMismatched) {
      // Prompt their wallet to switch networks
      switchChain(Mumbai.chainId)
    }
  }, [address]) // This above block gets run every time "address" changes (e.g. when the user connects)

  return (
    <ConnectWallet
      theme='dark'
      btnTitle='Connect Wallet'
      style={{
        background: 'transparent',
        border: 'none',
        color: '#99e9f2'
      }}
    />
  )
}
