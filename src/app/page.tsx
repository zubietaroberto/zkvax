"use client";

import { RegistrationLog } from "@/components/RegistrationLog";
import { ContractContext, useContract } from "@/components/useContractContext";
import Link from "next/link";

export default function HomePage() {
  const contract = useContract();

  return (
    <ContractContext.Provider value={{ contract }}>
      <h1>Home</h1>
      <ol>
        <li>
          <Link href="/registration">Register a new ID</Link>
        </li>

        <li>
          <Link href="/prove">Create a Zero Knowledge Proof</Link>
        </li>

        <li>
          <Link href="/verification">Verify an ID</Link>
        </li>
      </ol>

      <RegistrationLog />
    </ContractContext.Provider>
  );
}
