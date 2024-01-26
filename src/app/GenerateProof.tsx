import proverCircuit from "@/circuits/merkle_tree/target/merkle_tree.json" assert { type: "json" };
import {
  BarretenbergBackend,
  ProofData,
} from "@noir-lang/backend_barretenberg";
import { InputMap, Noir } from "@noir-lang/noir_js";
import { useState } from "react";
import styles from "./GenerateProof.module.css";
import { useContractContext } from "./useContractContext";
import { getProofDataFromContract } from "./getProofData";

const proverBackend = new BarretenbergBackend(proverCircuit as any);
const proverNoir = new Noir(proverCircuit as any, proverBackend);

enum GenerationState {
  NOT_STARTED,
  GENERATING,
  READY_TO_PROVE,
  PROVING,
  DONE_PROVING,
  ERROR,
}

export function GenerateProof() {
  const { contract } = useContractContext();
  const [generationState, setGenerationState] = useState<GenerationState>(
    GenerationState.NOT_STARTED
  );
  const [hashedSecret, setHashedSecret] = useState<string>("");
  const [proof, setProof] = useState<ProofData>();
  const [lastRoot, setLastRoot] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [indices, setIndices] = useState<string>("");
  const [hashPath, setHashPath] = useState<string[]>([]);

  async function getDataFromContract() {
    if (!contract) return;
    if (!secret) {
      alert("Please enter a secret");
      return;
    }

    setGenerationState(GenerationState.GENERATING);

    const result = await getProofDataFromContract(contract, secret);
    if (result) {
      setHashedSecret(result.hashedSecret);
      setLastRoot(result.lastRoot);
      setIndices(result.indices);
      setHashPath(result.hashPath);
    }

    setGenerationState(GenerationState.READY_TO_PROVE);
  }

  async function prove() {
    try {
      setGenerationState(GenerationState.PROVING);
      const inputs: InputMap = {
        root: lastRoot,
        secret: hashedSecret,
        indices: indices,
        hash_path: hashPath,
      };
      const proof = await proverNoir.generateFinalProof(inputs);
      console.log("proof", proof);
      setProof(proof);
      setGenerationState(GenerationState.DONE_PROVING);
    } catch (error) {
      console.error(error);
      setGenerationState(GenerationState.ERROR);
    }
  }

  return (
    <div>
      <h2>Build ZK Proof</h2>
      <pre></pre>
      <form className={styles.form}>
        <label>Secret (Will be Hashed)</label>
        <input
          type="text"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            getDataFromContract();
          }}
        >
          Load Data from Contract
        </button>

        {generationState === GenerationState.GENERATING && (
          <pre>Generating...</pre>
        )}

        {generationState === GenerationState.READY_TO_PROVE && (
          <>
            <label>Hashed Secret:</label>
            <input type="text" value={hashedSecret} readOnly />

            <label>Last Root:</label>
            <input type="text" value={lastRoot} readOnly />

            <label>Indices:</label>
            <input type="text" value={indices} readOnly />

            <label>Hash Path:</label>
            <textarea value={hashPath} readOnly />

            <button
              onClick={(e) => {
                e.preventDefault();
                prove();
              }}
            >
              Generate Proof
            </button>
          </>
        )}
      </form>

      <div>
        {generationState === GenerationState.PROVING && <pre>Proving...</pre>}

        {generationState === GenerationState.DONE_PROVING && proof && (
          <pre>{Buffer.from(proof.proof).toString("hex")}</pre>
        )}

        {generationState === GenerationState.DONE_PROVING && !proof && (
          <pre>Proof is empty (error?)</pre>
        )}

        {generationState === GenerationState.ERROR && (
          <pre>There was an error generating the proof</pre>
        )}
      </div>
    </div>
  );
}
