// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require('hardhat')

async function main () {
  // Marketplace contract
  const Marketplace = await ethers.getContractFactory('Marketplace')
  // Marketplace contract instance
  const marketplace = await Marketplace.deploy()
  // wait for contract to be deployed
  await marketplace.waitForDeployment()

  console.log(`
Marketplace deployed to: ${marketplace.target}

Blocker explorer: https://mumbai.polygonscan.com/address/${marketplace.target}
  `)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
