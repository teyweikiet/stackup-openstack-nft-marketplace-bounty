<br />
<div align="center">
  <a href="https://github.com/teyweikiet/stackup-openstack-nft-marketplace-bounty">
    <img src="frontend/app/favicon.ico" alt="Logo" width="50" height="50">
  </a>

  <h1 align="center" style="border-bottom: 0;">kit-t's Marketplace</h1>

  <p align="center">
    A full stack NFT marketplace Dapp!
    <br />
    <a href="https://stackup-openstack-nft-marketplace-bounty.vercel.app/"><strong>View Demo</strong></a>
    |
    <a href="https://mumbai.polygonscan.com/address/0x19dB8af00a177A46cf437E7Faa203b9379DE308b#code"><strong>View Contract</strong></a>
    <br />
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#functionalities">Functionalities</a></li>
      </ul>
    </li>
    <li>
      <a href="#how-tos">How Tos</a>
      <ul>
        <li><a href="#list-item">List Item</a></li>
        <li><a href="#buy-item">Buy Item</a></li>
      </ul>
    </li>
    <li>
      <a href="#built-with">Built With</a>
      <ul>
        <li><a href="#backend">Backend</a></li>
        <li><a href="#frontend">Frontend</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
  </ol>
</details>

## About the project

This is a submission for [StackUp's OpenStack NFT Marketplace Bounty](https://app.stackup.dev/bounty/openstack-nft-marketplace).

### Functionalities

- user can connect wallet to marketplace
- user can give approves marketplace to transfer NFT
- user can list own NFTs for sale
- user can buy listed NFTs

## How Tos

### List Item

1. First, click on "Connect Wallet" on the upper right corner.

1. After connected, you will be able to see "List NFT" button on the upper right corner. Click on it to open List Item form.

1. Fill in contract address and id for the NFT to be listed, then click "Next".

1. Wait for NFT to be loaded and fill up the selling price before submitting the form. You will be prompted to approve marketplace to transfer NFT and the transaction to list item.

### Buy Item

1. First, click on "Connect Wallet" on the upper right corner.

2. After connected, you will be able to see "Buy Now" button on NFT listed that are still available. Click on the button and approve the transaction to buy item.


## Built With

### Backend

- OpenZeppelin as framework to build secure smart contract

- Hardhat for unit testing & deployment of Solidity smart contract

- Polygon Mumbai as EVM testnet for the smart contract

### Frontend

- Next.js as framework for frontend web app development

- Mantine for building beautiful, responsive & accessible components

- Thirdweb SDK and Ethersjs for connecting to user wallet & interacting with the testnet

- Firebase for hosting frontend app

## Getting Started

### Prerequisites

- Install Node.js 18

### Installation

1. Clone the repo
```sh
git clone https://github.com/teyweikiet/stackup-openstack-nft-marketplace-bounty.git
```

#### Backend

1. Go to backend directory
```sh
cd backend
```

2. Install NPM packages
```sh
npm install
```

3. Create .env and modify accordingly
  - Get polygonscan api key [here](https://polygonscan.com/myaccount). [[how-to](https://docs.polygonscan.com/getting-started/viewing-api-usage-statistics)]
  - [To get wallet's private key in Metamask](https://support.metamask.io/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key)
```sh
cp .env.example .env
```

4. Compile and deploy smart contract to polygon mumbai
```sh
npm run compile
npm run deploy:mumbai
```

5. Get the address from console and use it for env in frontend

#### Frontend

1. Go to frontend directory
```sh
cd frontend
```

2. Install NPM packages
```sh
npm install
```

3. Create .env and modify accordingly
  - Get thirdweb client id [here](https://thirdweb.com/create-api-key). [[how-to](https://portal.thirdweb.com/api-keys#creating-an-api-key)]
```sh
cp .env.example .env
```
