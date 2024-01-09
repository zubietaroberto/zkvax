import {
  BarretenbergBackend,
  ProofData,
} from "@noir-lang/backend_barretenberg";
import { InputMap, Noir } from "@noir-lang/noir_js";
import { useEffect, useState } from "react";
import circuit from "../../noir/target/zkvax.json" assert { type: "json" };

const backend = new BarretenbergBackend(circuit as any);
const noir = new Noir(circuit as any, backend);

async function prove() {
  const input: InputMap = { x: 1, y: 2 };
  const proof = await noir.generateFinalProof(input);
  return proof;
}

export function Prover() {
  const [isProving, setIsProving] = useState(false);
  const [proof, setProof] = useState<ProofData["proof"]>();

  useEffect(() => {
    setIsProving(true);
    prove().then((proof) => {
      setProof(proof.proof);
      setIsProving(false);
    });
  }, [setProof, setIsProving]);

  return (
    <div>
      Proof:
      <div>
        <pre>{isProving ? "Proving..." : proof}</pre>
      </div>
    </div>
  );
}
