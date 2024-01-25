import proverCircuit from "@/circuits/merkle_tree/target/merkle_tree.json" assert { type: "json" };
import hasherCircuit1 from "@/circuits/poseidon_hash/target/poseidon_hash.json" assert { type: "json" };
import hasherCircuit2 from "@/circuits/poseidon_hash_2/target/poseidon_hash_2.json" assert { type: "json" };
import {
  BarretenbergBackend,
  ProofData,
} from "@noir-lang/backend_barretenberg";
import { InputMap, Noir } from "@noir-lang/noir_js";
import { useState } from "react";
import styles from "./GenerateProof.module.css";
import { useContractContext } from "./useContractContext";
import { getRegistrationEvents } from "./useRegistrationEvents";

const LEVELS = 32;
const hasherBackend = new BarretenbergBackend(hasherCircuit1 as any);
const hasherNoir = new Noir(hasherCircuit1 as any, hasherBackend);

const hasherBackend2 = new BarretenbergBackend(hasherCircuit2 as any);
const hasherNoir2 = new Noir(hasherCircuit2 as any, hasherBackend2);

const proverBackend = new BarretenbergBackend(proverCircuit as any);
const proverNoir = new Noir(proverCircuit as any, proverBackend);

// async function prove() {
//   const input: InputMap = { x: 1, y: 2 };
//   const proof = await hasherNoir.generateFinalProof(input);
//   return proof;
// }

enum GenerationState {
  NOT_STARTED,
  GENERATING,
  READY_TO_PROVE,
}

export function GenerateProof() {
  const { contract } = useContractContext();
  const [generationState, setGenerationState] = useState<GenerationState>(
    GenerationState.NOT_STARTED
  );
  const [isProving, setIsProving] = useState(false);
  const [hashedSecret, setHashedSecret] = useState<string>("");
  const [proof, setProof] = useState<ProofData>();
  const [lastRoot, setLastRoot] = useState<string>("NOT LOADED");
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

    // TODO: Find a way to do this without circuits
    await hasherNoir.init();
    const result = await hasherNoir.execute({
      secret: Buffer.from(secret).toString("hex"),
    });
    const newHashedSecret = result.returnValue;

    // Last Root
    const newLastRoot = await contract.getLastRoot();
    setLastRoot(newLastRoot);

    const events = await getRegistrationEvents(contract);
    const commitedEvent = events.find((e) => e.commitment === newHashedSecret);
    if (!commitedEvent) {
      alert("Secret not found in contract");
      return;
    }

    // get all the zero hashes
    const zeroHashes: string[] = [];
    for (let i = 0; i < LEVELS; i++) {
      const zeros = await contract.zeros(i);
      zeroHashes.push(zeros);
    }

    const startingLeaves = events
      .sort((a, b) => {
        if (a.leafIndex < b.leafIndex) return -1;
        else if (a.leafIndex > b.leafIndex) return 1;
        else return 0;
      })
      .map((e) => e.commitment);

    // Hash Path
    await hasherNoir2.init();
    let nextLevel: string[] = startingLeaves;
    let newHashpath: string[] = [];
    let lookingForLeaf = newHashedSecret;
    let newIndices = "";
    for (let index = 0; index < LEVELS; index++) {
      const newLevel: string[] = [];
      for (let j = 0; j < nextLevel.length; j += 2) {
        const left = nextLevel[j];
        const right = nextLevel[j + 1] || zeroHashes[index];
        const newStem = await hasherNoir2.execute({
          secret1: left,
          secret2: right,
        });
        const newStemHash = newStem.returnValue.toString();
        newLevel.push(newStemHash);

        // if we found the leaf, record the current values
        if (left === lookingForLeaf) {
          newHashpath.push(left);
          lookingForLeaf = newStemHash;
          newIndices = "0" + newIndices;
        }

        if (right === lookingForLeaf) {
          newHashpath.push(right);
          lookingForLeaf = newStemHash;
          newIndices = "1" + newIndices;
        }
      }
      nextLevel = newLevel;
    }

    const [newSecret, ...newPath] = newHashpath;
    setHashedSecret(newSecret);
    setHashPath(newPath);
    setIndices(`0x${newIndices}`);

    setGenerationState(GenerationState.READY_TO_PROVE);
  }

  async function prove() {
    setIsProving(true);
    const inputs: InputMap = {
      root: lastRoot,
      secret: hashedSecret,
      indices: indices,
      hash_path: hashPath,
    };
    const proof = await proverNoir.generateFinalProof(inputs);
    console.log(proof);
    setProof(proof);
    setIsProving(false);
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

        {proof && (
          <>
            <label>Proof:</label>
            <textarea
              value={Buffer.from(proof.proof).toString("hex")}
              readOnly
            />
          </>
        )}
      </form>

      <div>
        <pre>{isProving ? "Proving..." : proof?.proof}</pre>
      </div>
    </div>
  );
}
