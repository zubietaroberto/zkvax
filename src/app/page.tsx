"use client";

import { ContractContext, useContract } from "@/components/useContractContext";
import { GenerateProof } from "./GenerateProof";
import { RegistrationLog } from "./RegistrationLog";
import { Verifier } from "./Verifier";
import { VerifierFromContract } from "./VerifierFromContract";

export default function TestPage2() {
  const contract = useContract();

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
      <button onClick={test}>Get Last Root</button>

      <hr />
      <RegistrationLog />

      <hr />
      <GenerateProof />

      <hr />
      <Verifier />

      <hr />
      <VerifierFromContract />
    </ContractContext.Provider>
  );
}
