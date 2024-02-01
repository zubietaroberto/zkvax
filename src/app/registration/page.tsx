"use client";

import { ContractContext, useContract } from "@/components/useContractContext";
import { Insert } from "./Insert";

export default function RegistrationPage() {
  const contract = useContract();

  return (
    <ContractContext.Provider value={{ contract }}>
      <Insert />
    </ContractContext.Provider>
  );
}
