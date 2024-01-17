import { expect } from "chai";
import { ethers } from "hardhat";

const PRECOMPUTED_HASH_0 =
  "0x2098f5fb9e239eab3ceac3f27b81e481dc3124d55ffed523a839ee8446b64864";
const PRECOMPUTED_HASH_1 =
  "0x1069673dcdb12263df301a6ff584a7ec261a44cb9dc68df067a4774460b1f1e1";

describe("MerkleRegistry", function () {
  it("hashLeftRight should work", async () => {
    const MerkleRegistryContract = await ethers.getContractFactory(
      "MerkleRegistry"
    );

    const result = await MerkleRegistryContract.deploy(4);
    await result.deploymentTransaction()?.wait();

    const hash = await result.hashLeftRight(0, 0);
    expect(hash).to.equal(ethers.toBigInt(PRECOMPUTED_HASH_0));

    const hash2 = await result.hashLeftRight(hash, hash);
    expect(hash2).to.equal(ethers.toBigInt(PRECOMPUTED_HASH_1));
  });
});
