import "dotenv/config";
import { ethers } from "hardhat";

async function main() {
  const registryContract = await ethers.getContractFactory("Registrar");
  const registry = await registryContract.deploy(31);
  const registryAddress = await registry.getAddress();
  console.log(`Registry delpoyed to: ${registryAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
