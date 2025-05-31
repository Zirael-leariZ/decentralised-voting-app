// Load .env config (token, prover URL)
import "dotenv/config";
import fs from "fs/promises";
import { createVlayerClient } from "@vlayer/sdk";

// Load ABI for the deployed EmailAccessProver contract
import fullAbi from "./abi/EmailAccessProver.json" assert { type: "json" };
const proverAbi = fullAbi.abi;

// Read .eml filepath from command line
const filepath = process.argv[2];
const VLAYER_TOKEN = process.env.VLAYER_TOKEN;
const VLAYER_PROVER_URL = process.env.VLAYER_PROVER_URL;

async function main() {
  if (!VLAYER_TOKEN || !VLAYER_PROVER_URL) {
    throw new Error("Missing VLAYER_TOKEN or VLAYER_PROVER_URL in .env");
  }

  const client = createVlayerClient({
    url: VLAYER_PROVER_URL,
    token: VLAYER_TOKEN,
  });

  const file = await fs.readFile(filepath);

  // Submit proof request directly with .eml file
  const result = await client.prove({
    file: new Uint8Array(file),
    chainId: 11155420, // Optimism Sepolia
    address: "0xBa4011B617DBc8cA774dd619C55a13765B81Dd62", // Prover address
    proverAbi,
    functionName: "main"
  });

  console.log(JSON.stringify(result, null, 2));
}

main();
