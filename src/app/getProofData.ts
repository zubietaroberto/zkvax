import hasherCircuit1 from "@/circuits/poseidon_hash/target/poseidon_hash.json" assert { type: "json" };
import hasherCircuit2 from "@/circuits/poseidon_hash_2/target/poseidon_hash_2.json" assert { type: "json" };
import { BarretenbergBackend } from "@noir-lang/backend_barretenberg";
import { Noir } from "@noir-lang/noir_js";
import { getRegistrationEvents } from "./useRegistrationEvents";
import { Registrar } from "@/typechain";

const LEVELS = 32;
const hasherBackend = new BarretenbergBackend(hasherCircuit1 as any);
const hasherNoir = new Noir(hasherCircuit1 as any, hasherBackend);

const hasherBackend2 = new BarretenbergBackend(hasherCircuit2 as any);
const hasherNoir2 = new Noir(hasherCircuit2 as any, hasherBackend2);

export interface ContractdataResults {
  lastRoot: string;
  hashedSecret: string;
  hashPath: string[];
  indices: string;
}

export async function getProofDataFromContract(
  contract: Registrar,
  secret: string
): Promise<ContractdataResults | null> {
  // TODO: Find a way to do this without circuits
  await hasherNoir.init();
  const result = await hasherNoir.execute({
    secret: Buffer.from(secret).toString("hex"),
  });
  const newHashedSecret = result.returnValue;

  // Last Root
  const newLastRoot = await contract.getLastRoot();

  const events = await getRegistrationEvents(contract);
  const commitedEvent = events.find((e) => e.commitment === newHashedSecret);
  if (!commitedEvent) {
    alert("Secret not found in contract");
    return null;
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
  return {
    lastRoot: newLastRoot,
    hashedSecret: newSecret,
    hashPath: newPath,
    indices: `0x${newIndices}`,
  };
}
