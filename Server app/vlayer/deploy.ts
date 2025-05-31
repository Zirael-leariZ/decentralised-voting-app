import { getConfig, writeEnvVariables } from "@vlayer/sdk/config";
import { ethers } from "ethers";
import verifierArtifact from "../out/EmailAccessVerifier.sol/EmailAccessVerifier.json";
import faucetArtifact from "../out/GasFaucet.sol/GasFaucet.json";
import factoryArtifact from "../out/VotingFactory.sol/VotingFactory.json";

console.log("🚀 Starting deploy...");

const config = getConfig();
const provider = new ethers.JsonRpcProvider(config.jsonRpcUrl);
const wallet = new ethers.Wallet(config.privateKey, provider);

async function deploy() {
  // 1. Deploy EmailAccessVerifier
  const Verifier = new ethers.ContractFactory(verifierArtifact.abi, verifierArtifact.bytecode, wallet);
  const verifier = await Verifier.deploy(wallet.address);
  await verifier.waitForDeployment();
  console.log("✅ Verifier deployed:", verifier.target);

  // 2. Deploy GasFaucet
  const Faucet = new ethers.ContractFactory(faucetArtifact.abi, faucetArtifact.bytecode, wallet);
  const faucet = await Faucet.deploy(wallet.address);
  await faucet.waitForDeployment();
  console.log("✅ GasFaucet deployed:", faucet.target);

  // 3. Deploy VotingFactory
  const Factory = new ethers.ContractFactory(factoryArtifact.abi, factoryArtifact.bytecode, wallet);
  const factory = await Factory.deploy();
  await factory.waitForDeployment();
  console.log("✅ VotingFactory deployed:", factory.target);

  // 4. Write to .env
  await writeEnvVariables(".env", {
    VITE_CHAIN_NAME: config.chainName,
    VITE_JSON_RPC_URL: config.jsonRpcUrl,
    VITE_PRIVATE_KEY: config.privateKey,
    VITE_VLAYER_API_TOKEN: config.token,
    VITE_VERIFIER_ADDRESS: verifier.target,
    VITE_FAUCET_ADDRESS: faucet.target,
    VITE_FACTORY_ADDRESS: factory.target,
  });
}

deploy().catch((e) => {
  console.error("❌ Deployment failed:", e);
  process.exit(1);
});
