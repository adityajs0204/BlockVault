import fs from "fs";
import fse from "fs-extra";
import path from "path";
import solc from "solc";
import { ethers } from "ethers";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config({ path: path.resolve("../.env") });

async function main() {
  try {
    const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:7545";
    const PRIVATE_KEY = process.env.PRIVATE_KEY;

    if (!PRIVATE_KEY) {
      console.error("❌ Add PRIVATE_KEY to .env before running deploy!");
      process.exit(1);
    }

    console.log("📝 Compiling smart contract...");

    // ✅ FIXED FOR WINDOWS: Properly resolve __dirname in ESM
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // ✅ Correct relative path (works no matter where you run from)
    const contractPath = path.join(__dirname, "DocumentRegistry.sol");
    const source = fs.readFileSync(contractPath, "utf8");

    const input = {
      language: "Solidity",
      sources: { "DocumentRegistry.sol": { content: source } },
      settings: { outputSelection: { "*": { "*": ["*"] } } },
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input)));

    if (output.errors) {
      output.errors.forEach((err) => console.log(err.formattedMessage));
      if (output.errors.some((e) => e.severity === "error")) {
        throw new Error("Compilation failed!");
      }
    }

    const { abi, evm } = output.contracts["DocumentRegistry.sol"].DocumentRegistry;

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    console.log("🚀 Deploying contract...");

    const factory = new ethers.ContractFactory(abi, evm.bytecode.object, wallet);
    const contract = await factory.deploy();
    await contract.waitForDeployment();

    const address = await contract.getAddress();
    console.log("✅ Deployed successfully!");
    console.log("📜 Contract Address:", address);

    // ✅ Save contract info (in same folder)
    const outputPath = path.join(__dirname, "contractInfo.json");
    fse.outputJsonSync(outputPath, { address, abi }, { spaces: 2 });

    console.log(`💾 Saved contractInfo.json to: ${outputPath}`);
    console.log("🎉 Deployment complete!\n");
  } catch (err) {
    console.error("❌ Error deploying contract:", err.message);
  }
}

main();
