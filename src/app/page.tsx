"use client";

import { Registrar, Registrar__factory } from "@/typechain";
import { ethers } from "ethers";
import { JsonRpcProvider } from "ethers/providers";
import { useEffect, useState } from "react";
import { Insert } from "./Insert";
import { RegistrationLog } from "./RegistrationLog";
import { ContractContext } from "./useContractContext";
import { GenerateProof } from "./GenerateProof";
import { Verifier } from "./Verifier";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_REGISTRAR_ADDRESS as string;
const provider = new JsonRpcProvider("http://localhost:8545");
const testSigner = new ethers.Wallet(
  process.env.NEXT_PUBLIC_TEST_PRIVATE_KEY as string,
  provider
);

export default function TestPage2() {
  const [contract, setContract] = useState<Registrar>();

  useEffect(() => {
    async function connect() {
      const newContract = Registrar__factory.connect(
        CONTRACT_ADDRESS,
        testSigner
      );
      setContract(newContract);
    }

    connect();
  }, []);

  async function test() {
    if (!contract) {
      alert("Please connect first");
      return;
    }

    const tx = await contract.getLastRoot();
    alert(tx);
  }

  return (
    <ContractContext.Provider value={{ contract }}>
      <h1>Test Page 2</h1>
      <button onClick={test}>Test</button>

      <hr />
      <Insert />

      <hr />
      <RegistrationLog />

      <hr />
      <GenerateProof />

      <hr />
      <Verifier />
    </ContractContext.Provider>
  );
}
