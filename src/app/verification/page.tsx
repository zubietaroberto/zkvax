"use client";

import { RegistrationLog } from "@/components/RegistrationLog";
import { ContractContext, useContract } from "@/components/useContractContext";
import { Verifier } from "./Verifier";
import { VerifierFromContract } from "./VerifierFromContract";
import { useEffect, useState } from "react";

export default function VerificationPage() {
  const contract = useContract();
  const [lastRoot, setLastRoot] = useState<string>("LOADING...");

  useEffect(() => {
    contract?.getLastRoot().then((root) => {
      setLastRoot(root);
    });
  }, [contract, setLastRoot]);

  return (
    <ContractContext.Provider value={{ contract }}>
      <h1>Verification</h1>

      <p>
        The last merkle tree root is <b>{lastRoot}</b>
      </p>

      <hr />
      <RegistrationLog />

      <hr />
      <Verifier />

      <hr />
      <VerifierFromContract />
    </ContractContext.Provider>
  );
}
