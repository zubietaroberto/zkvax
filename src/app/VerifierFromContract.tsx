import { useState } from "react";
import styles from "./Verifier.module.css";
import { useContractContext } from "./useContractContext";

enum VerificationState {
  NOT_STARTED,
  VERIFYING,
  DONE_VERIFYING,
  ERROR,
}

export function VerifierFromContract() {
  const [stateMachine, setStateMachine] = useState<VerificationState>(
    VerificationState.NOT_STARTED
  );
  const { contract } = useContractContext();
  const [root, setRoot] = useState<string>("");
  const [proofText, setProofText] = useState<string>();

  async function doVerify() {
    if (!proofText) return;
    if (!contract) return;

    setStateMachine(VerificationState.VERIFYING);
    const publicInputs: Map<number, string> = new Map();
    publicInputs.set(0, "");

    try {
      const result = await contract.check(Buffer.from(proofText, "hex"), root);
      await result.wait();

      setStateMachine(VerificationState.DONE_VERIFYING);
    } catch (error) {
      console.error(error);
      setStateMachine(VerificationState.ERROR);
    }
  }

  return (
    <section>
      <h2>Verify on the Contract:</h2>

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
