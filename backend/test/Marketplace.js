const {
  loadFixture
} = require('@nomicfoundation/hardhat-toolbox/network-helpers')
const { expect } = require('chai')
const { ethers } = require('hardhat')

const PRICE = BigInt(10)

describe('Marketplace', () => {
  async function deployMarketplaceFixture () {
    const [Marketplace, TestNft] = await Promise.all([
      ethers.getContractFactory('Marketplace'),
      ethers.getContractFactory('TestNft')
    ])

    const [marketplace, testNft, [seller, buyer]] = await Promise.all([
      Marketplace.deploy(),
      TestNft.deploy(),
      ethers.getSigners()
    ])

    const provider = await buyer.provider

    await testNft.connect(seller).mint()

    return { marketplace, testNft, seller, buyer, provider }
  }

  async function listItem (testNft, marketplace, seller) {
    await testNft.connect(seller).approve(marketplace.target, 0)
    await marketplace.connect(seller).listItem(PRICE, testNft.target, 0)
  }

  describe('listItem()', () => {
    it('Should emit ItemListed on successful transaction', async () => {
      const { marketplace, testNft, seller } = await loadFixture(deployMarketplaceFixture)

      await testNft.connect(seller).approve(marketplace.target, 0)
      const txn = marketplace.connect(seller).listItem(PRICE, testNft.target, 0)

      await expect(txn)
        .to.emit(marketplace, 'ItemListed')
        .withArgs(0, PRICE)
    })

    it('Should not allow to list item with price 0', async () => {
      const { marketplace, testNft, seller } = await loadFixture(deployMarketplaceFixture)

      const txn = marketplace.connect(seller).listItem(0, testNft.target, 0)

      await expect(txn).to.be.revertedWith('Price must be greater than 0')
    })

    it('Should not allow to list item without owner approval', async () => {
      const { marketplace, testNft, seller } = await loadFixture(deployMarketplaceFixture)

      const txn = marketplace.connect(seller).listItem(PRICE, testNft.target, 0)

      await expect(txn).to.be.revertedWith('No approval to marketplace')
    })

    it('Should not allow non owner to list item', async () => {
      const { marketplace, testNft, buyer } = await loadFixture(deployMarketplaceFixture)

      const txn = marketplace.connect(buyer).listItem(PRICE, testNft.target, 0)

      await expect(txn).to.be.revertedWith('Only owner is allowed to list item')
    })
  })

  describe('buyItem()', () => {
    it('Should emit ItemSold on successful transaction', async () => {
      const { marketplace, testNft, seller, buyer, provider } = await loadFixture(deployMarketplaceFixture)

      await listItem(testNft, marketplace, seller)

      const sellerBalanceBefore = BigInt(await provider.getBalance(seller.address))

      const txn = marketplace.connect(buyer).buyItem(0, { value: PRICE })

      await expect(txn)
        .to.emit(marketplace, 'ItemSold')
        .withArgs(0)

      const sellerBalanceAfter = BigInt(await provider.getBalance(seller.address))

      expect(sellerBalanceBefore + PRICE).to.equal(sellerBalanceAfter)
    })

    it('Should revert if no listing found for id', async () => {
      const { marketplace, testNft, seller, buyer } = await loadFixture(deployMarketplaceFixture)
      await listItem(testNft, marketplace, seller)

      const txn = marketplace.connect(buyer).buyItem(2, { value: PRICE })

      await expect(txn)
        .to.be.revertedWith('Listing not found')
    })

    it('Should revert if item is already sold', async () => {
      const { marketplace, testNft, seller, buyer } = await loadFixture(deployMarketplaceFixture)
      await listItem(testNft, marketplace, seller)
      await marketplace.connect(buyer).buyItem(0, { value: PRICE })

      const txn = marketplace.connect(buyer).buyItem(0, { value: PRICE })

      await expect(txn)
        .to.be.revertedWith('Item is already sold')
    })

    it('Should revert if seller try to buy the item', async () => {
      const { marketplace, testNft, seller } = await loadFixture(deployMarketplaceFixture)
      await listItem(testNft, marketplace, seller)

      const txn = marketplace.connect(seller).buyItem(0, { value: PRICE })

      await expect(txn)
        .to.be.revertedWith('Seller cannot be buyer')
    })

    it('Should revert if amount pay not equals price', async () => {
      const { marketplace, testNft, seller, buyer } = await loadFixture(deployMarketplaceFixture)
      await listItem(testNft, marketplace, seller)

      const txn = marketplace.connect(buyer).buyItem(0, { value: 2 })

      await expect(txn)
        .to.be.revertedWith('Amount paid not equals price')
    })
  })
})
