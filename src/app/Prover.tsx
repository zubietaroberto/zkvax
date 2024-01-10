import circuit from "@/circuits/zkvax.json" assert { type: "json" };
import {
  BarretenbergBackend,
  ProofData,
} from "@noir-lang/backend_barretenberg";
import { InputMap, Noir } from "@noir-lang/noir_js";
import { useEffect, useState } from "react";

const backend = new BarretenbergBackend(circuit as any);
const noir = new Noir(circuit as any, backend);

async function prove() {
  const input: InputMap = { x: 1, y: 2 };
  const proof = await noir.generateFinalProof(input);
  return proof;
}

async function verify(proofData: ProofData) {
  return noir.verifyFinalProof(proofData);
}

export function Prover() {
  const [isProving, setIsProving] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [proof, setProof] = useState<ProofData>();
  const [verification, setVerification] = useState<boolean | null>(null);

  useEffect(() => {
    setIsProving(true);
    prove().then((proof) => {
      setProof(proof);
      setIsProving(false);
    });
  }, [setProof, setIsProving]);

  useEffect(() => {
    if (!proof) return;

    setIsVerifying(true);
    verify(proof).then((result) => {
      setVerification(result);
      setIsVerifying(false);
    });
  }, [proof, setIsVerifying, setVerification]);

  return (
    <div>
      Proof:
      <div>
        <pre>{isProving ? "Proving..." : proof?.proof}</pre>
      </div>
      Verify:
      <div>
        <pre>
          {isVerifying
            ? "Verifying..."
            : verification
            ? "VERIFIED"
            : "VERIFICATION FAILED"}
        </pre>
      </div>
    </div>
  );
}
