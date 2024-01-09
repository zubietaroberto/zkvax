"use client";

import {
  BarretenbergBackend,
  ProofData,
} from "@noir-lang/backend_barretenberg";
import { InputMap, Noir } from "@noir-lang/noir_js";
import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import circuit from "../../noir/target/zkvax.json" assert { type: "json" };

const backend = new BarretenbergBackend(circuit as any);
const noir = new Noir(circuit as any, backend);

async function prove() {
  const input: InputMap = { x: 1, y: 2 };
  const proof = await noir.generateFinalProof(input);
  return proof;
}

export default function App() {
  const account = useAccount();
  const [isProving, setIsProving] = useState(false);
  const [proof, setProof] = useState<ProofData["proof"]>();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    setIsProving(true);
    prove().then((proof) => {
      setProof(proof.proof);
      setIsProving(false);
    });
  }, [setProof, setIsProving]);

  return (
    <>
      <div>
        <h2>Account</h2>

        <div>
          status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          chainId: <pre>{account.chainId}</pre>
        </div>

        {account.status === "connected" && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>

      <div>
        Proof:
        <div>
          <pre>{isProving ? "Proving..." : proof}</pre>
        </div>
      </div>

      <div>
        <h2>Connect</h2>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button"
          >
            {connector.name}
          </button>
        ))}
        <div>{status}</div>
        <div>{error?.message}</div>
      </div>
    </>
  );
}
