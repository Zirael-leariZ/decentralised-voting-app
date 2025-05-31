const { ethers } = require('ethers');
require('dotenv').config();
const factoryABI = require('../abi/VotingFactory.json');
const faucetABI = require('../abi/GasFaucet.json');
const verifierABI = require('../abi/EmailAccessVerifier.json');

const provider = new ethers.JsonRpcProvider(process.env.JSON_RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const factory = new ethers.Contract(process.env.FACTORY_ADDRESS, factoryABI, signer);
const faucet = new ethers.Contract(process.env.FAUCET_ADDRESS, faucetABI, signer);
const verifier = new ethers.Contract(process.env.VERIFIER_ADDRESS, verifierABI, signer);

module.exports = { factory, faucet, verifier };
