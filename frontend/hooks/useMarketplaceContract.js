import { abi } from '../artifacts/Marketplace.json'
const { useContract, useContractRead, useContractWrite } = require('@thirdweb-dev/react')

export const useMarketplaceContract = () => {
  return useContract(process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS, abi)
}

export const useMarketplaceContractRead = (...params) => {
  const { contract } = useMarketplaceContract()

  return useContractRead(contract, ...params)
}

export const useMarketplaceContractWrite = (...params) => {
  const { contract } = useMarketplaceContract()

  return useContractWrite(contract, ...params)
}
