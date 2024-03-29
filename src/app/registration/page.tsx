"use client";

import { RegistrationLog } from "@/components/RegistrationLog";
import { ContractContext, useContract } from "@/components/useContractContext";
import { Insert } from "./Insert";

export default function RegistrationPage() {
  const contract = useContract();

  return (
    <ContractContext.Provider value={{ contract }}>
      <h1>Register a new ID</h1>
      <Insert />

      <hr />
      <RegistrationLog />
    </ContractContext.Provider>
  );
}
