"use client";

import { ContractContext, useContract } from "@/components/useContractContext";
import { RegistrationLog } from "@/components/RegistrationLog";
import { GenerateProof } from "./GenerateProof";

export default function ProofPage() {
  const contract = useContract();

  return (
    <ContractContext.Provider value={{ contract }}>
      <h1>Generate ZK Proof</h1>

      <hr />
      <RegistrationLog />

      <hr />
      <GenerateProof />
    </ContractContext.Provider>
  );
}
