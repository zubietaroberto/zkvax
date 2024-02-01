"use client";

import { ContractContext, useContract } from "@/components/useContractContext";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <h1>Home</h1>
      <ol>
        <li>
          <Link href="/registration">Register a new ID</Link>
        </li>
        <li>
          <Link href="/verification">Verify an ID</Link>
        </li>
      </ol>
    </>
  );
}
