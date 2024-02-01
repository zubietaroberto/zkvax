import proverCircuit from "@/circuits/merkle_tree.json" assert { type: "json" };
import { useContractContext } from "@/components/useContractContext";
import {
  BarretenbergBackend,
  ProofData,
} from "@noir-lang/backend_barretenberg";
import { InputMap, Noir } from "@noir-lang/noir_js";
import { useState } from "react";
import styles from "./GenerateProof.module.css";
import { getProofDataFromContract } from "./getProofData";

const proverBackend = new BarretenbergBackend(proverCircuit as any);
const proverNoir = new Noir(proverCircuit as any, proverBackend);

enum GenerationState {
  NOT_STARTED,
  LOADING,
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
  const [proof, setProof] = useState<ProofData>();
  const [inputs, setInputs] = useState<InputMap>();
  const [secret, setSecret] = useState<string>("");

  async function getDataFromContract() {
    if (!contract) return;
    if (!secret) {
      alert("Please enter a secret");
      return;
    }

    setGenerationState(GenerationState.LOADING);

    try {
      const result = await getProofDataFromContract(contract, secret);
      if (result) {
        setInputs({
          root: result.lastRoot,
          secret: result.hashedSecret,
          indices: result.indices,
          hash_path: result.hashPath,
        });
      }

      setGenerationState(GenerationState.READY_TO_PROVE);
    } catch (error) {
      console.error(error);
      setGenerationState(GenerationState.ERROR);
    }
  }

  async function prove() {
    if (!inputs) {
      alert("Please load data from contract first");
      return;
    }

    try {
      setGenerationState(GenerationState.PROVING);
      await proverNoir.init();
      const proof = await proverNoir.generateFinalProof(inputs);
      console.log("proof", Buffer.from(proof.proof).toString("hex"));
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

        {generationState === GenerationState.LOADING && (
          <pre>Loading data from contract...</pre>
        )}

        {generationState === GenerationState.READY_TO_PROVE && (
          <>
            <label>Hashed Secret:</label>
            <input
              type="text"
              value={inputs?.["secret"].toString() ?? ""}
              readOnly
            />

            <label>Last Root:</label>
            <input
              type="text"
              value={inputs?.["root"].toString() ?? ""}
              readOnly
            />

            <label>Indices:</label>
            <input
              type="text"
              value={inputs?.["indices"].toString() ?? ""}
              readOnly
            />

            <label>Hash Path:</label>
            <textarea value={inputs?.["hash_path"].toString() ?? ""} readOnly />

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
        {generationState === GenerationState.PROVING && (
          <>
            <pre>Proving...</pre>
          </>
        )}

        {generationState === GenerationState.DONE_PROVING && proof && (
          <>
            <label className="span-row">Generated proof: </label>
            <div className="span-row result">
              {Buffer.from(proof.proof).toString("hex")}
            </div>
          </>
        )}

        {generationState === GenerationState.DONE_PROVING && !proof && (
          <>
            <label>Proof:</label>
            <textarea value="No proof generated" readOnly />
          </>
        )}

        {generationState === GenerationState.ERROR && (
          <pre>There was an error generating the proof</pre>
        )}
      </form>
    </div>
  );
}
