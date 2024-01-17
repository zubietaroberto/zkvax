import { expect } from "chai";
import { ethers } from "hardhat";

const PRECOMPUTED_HASH =
  "0x2098f5fb9e239eab3ceac3f27b81e481dc3124d55ffed523a839ee8446b64864";

describe("MerkleRegistry", function () {
  it("hashtest should work", async () => {
    const MerkleRegistryContract = await ethers.getContractFactory(
      "MerkleRegistry"
    );

    const result = await MerkleRegistryContract.deploy();
    await result.deploymentTransaction()?.wait();

    const hash = await result.hashTest(0, 0);
    expect(hash).to.equal(ethers.toBigInt(PRECOMPUTED_HASH));
  });
});
