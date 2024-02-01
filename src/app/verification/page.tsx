"use client";

import { ContractContext, useContract } from "@/components/useContractContext";
import { RegistrationLog } from "./RegistrationLog";
import { GenerateProof } from "./GenerateProof";
import { Verifier } from "./Verifier";
import { VerifierFromContract } from "./VerifierFromContract";

export default function VerificationPage() {
  const contract = useContract();

  return (
    <ContractContext.Provider value={{ contract }}>
      <h1>Verification</h1>

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
