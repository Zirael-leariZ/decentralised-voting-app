# Decentralised Voting App

A decentralised voting application (DApp) that enables secure, transparent, and tamper-resistant voting using blockchain smart contracts. This repository contains the smart contracts, deployment scripts, and a web-based frontend to interact with the contracts.

> Note: This README is a template and starter guide. Update the commands, paths, and configuration values below to match the actual structure of your repository.

## Table of contents

- [Key features](#key-features)
- [Architecture](#architecture)
- [Tech stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Repository layout](#repository-layout)
- [Quickstart — run locally](#quickstart--run-locally)
  - [1. Clone](#1-clone)
  - [2. Install dependencies](#2-install-dependencies)
  - [3. Configure environment variables](#3-configure-environment-variables)
  - [4. Start local blockchain and deploy contracts](#4-start-local-blockchain-and-deploy-contracts)
  - [5. Run frontend](#5-run-frontend)

## Key features

- On-chain voting smart contract logic (register candidates, open/close voting, cast votes).
- Role-based access (e.g., admin/owner that can create elections and manage phases).
- Transparent and auditable vote storage on-chain.
- Frontend web UI to create elections, register candidates, and vote using a Web3 wallet (MetaMask).
- Local development support (Hardhat/Truffle) and automated tests.

## Architecture

- Smart contracts (Solidity) — election and voting logic.
- Deployment scripts (Hardhat / Truffle).
- Frontend (React) — user interface interacting with contracts via Ethers.js or web3.js.
- Optional backend for off-chain indexing / analytics (if included).

High-level flow:
1. Admin deploys Election contract and creates an election.
2. Admin registers candidates.
3. Voters connect with MetaMask and cast votes.
4. Votes recorded on-chain and results can be read from the contract.

## Tech stack

- Solidity — smart contracts
- Hardhat — development, testing, and deployment
- Ethers.js or web3.js — contract interaction
- React — frontend UI
- npm / yarn — package management
- Ganache / Hardhat Network — local blockchain for testing

Replace or adjust tools to match your repository as needed.

## Prerequisites

- pnpm optional
- MetaMask browser extension (for using the frontend with testnets or local node)
- Hardhat
- An Ethereum node provider (Alchemy / Infura) for testnet/mainnet deployments

## Repository layout (example)

Adjust these paths to your repo structure.

- contracts/ — Solidity contracts
- scripts/ — deployment and helper scripts
- test/ — unit & integration tests
- frontend/ — React app
- hardhat.config.js 
- package.json

## Quickstart — run locally

These are generic steps; adjust to your repo's scripts.

### 1. Clone
```bash
git clone https://github.com/oishchen42/decentralised-voting-app.git
cd decentralised-voting-app
```

### 2. Install dependencies
Root (if monorepo containing both contracts and frontend):
```bash
# from repo root
npm install
# or
yarn install
```

If contracts and frontend have separate package.json:
```bash
cd contracts
npm install
cd ../frontend
npm install
```

### 3. Configure environment variables

Create a .env file in the appropriate directories. Example variables:

- For Hardhat / deployment:
```
PRIVATE_KEY=0xYOUR_PRIVATE_KEY
RPC_URL=http://127.0.0.1:8545            # or https://eth-goerli.alchemyapi.io/...
ETHERSCAN_API_KEY=your_etherscan_key    # for verification
```

- For frontend:
```
REACT_APP_CONTRACT_ADDRESS=0x...
REACT_APP_NETWORK=localhost
REACT_APP_RPC_URL=http://127.0.0.1:8545
```

Never commit real private keys. Use environment management or vaults for CI/CD.

### 4. Start local blockchain and deploy contracts

Start local Hardhat node:
```bash
npx hardhat node
```

In another terminal, deploy contracts (example Hardhat script):
```bash
npx hardhat run --network localhost scripts/deploy.js
```

Copy the deployed contract address and add it to the frontend environment or config.

### 5. Run frontend
From the frontend folder:
```bash
cd frontend
npm start
# or
yarn start
```

Open http://localhost:3000 and connect your wallet (MetaMask configured to the local network).
