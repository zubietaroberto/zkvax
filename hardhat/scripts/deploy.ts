import { ethers } from "hardhat";

const merkleRoot =
  "0x29fd5ee89e33f559a7b32ac39f57400aa5a6c77492e28c088f9eb511b0c73e78";
const nullifierHash =
  "0x1cbb284a43dde14da2c3790e12872bcb7e53c53e27b5187384c617841174ace5";

async function main() {
  const verifierContract = await ethers.getContractFactory("UltraVerifier");
  const verifier = await verifierContract.deploy();
  const verifierAddress = await verifier.getAddress();
  console.log(`Verifier delpoyed to: ${verifierAddress}`);

  const votingContract = await ethers.getContractFactory("Voting");
  const voting = await votingContract.deploy(merkleRoot, verifierAddress);
  const votingAddress = await voting.getAddress();
  console.log(`Voting delpoyed to: ${votingAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
