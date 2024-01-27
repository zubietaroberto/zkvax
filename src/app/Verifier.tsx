import circuit from "@/circuits/merkle_tree/target/merkle_tree.json" assert { type: "json" };
import { BarretenbergBackend } from "@noir-lang/backend_barretenberg";
import { Noir } from "@noir-lang/noir_js";
import { useState } from "react";
import styles from "./Verifier.module.css";

const backend = new BarretenbergBackend(circuit as any);
const noir = new Noir(circuit as any, backend);

enum VerificationState {
  NOT_STARTED,
  VERIFYING,
  DONE_VERIFYING,
  ERROR,
}

export function Verifier() {
  const [stateMachine, setStateMachine] = useState<VerificationState>(
    VerificationState.NOT_STARTED
  );
  const [root, setRoot] = useState<string>("");
  const [proofText, setProofText] = useState<string>();
  const [verification, setVerification] = useState<boolean | null>(null);

  async function doVerify() {
    if (!proofText) return;

    setStateMachine(VerificationState.VERIFYING);
    const publicInputs: Map<number, string> = new Map();
    publicInputs.set(0, "");

    await noir.init();
    try {
      const result = await noir.verifyFinalProof({
        proof: Buffer.from(proofText, "hex"),
        publicInputs,
      });
      setVerification(result);
      setStateMachine(VerificationState.DONE_VERIFYING);
    } catch (error) {
      console.error(error);
      setStateMachine(VerificationState.ERROR);
    }
  }

  return (
    <section>
      <h2>Verify:</h2>

      <form className={styles.form}>
        <label>Tree Root Hash:</label>
        <input value={root} onChange={(e) => setRoot(e.target.value)} />

        <label>Proof Data:</label>
        <textarea
          rows={10}
          cols={50}
          onChange={(e) => setProofText(e.target.value)}
        />

        <button
          onClick={(e) => {
            e.preventDefault();
            doVerify();
          }}
        >
          Verify
        </button>

        <pre>
          {stateMachine === VerificationState.NOT_STARTED && (
            <>Waiting for input...</>
          )}
          {stateMachine === VerificationState.VERIFYING && <>Verifying...</>}
          {stateMachine === VerificationState.DONE_VERIFYING && <>VERIFIED</>}
          {stateMachine === VerificationState.ERROR && <>VERIFICATION FAILED</>}
        </pre>
      </form>
    </section>
  );
}
