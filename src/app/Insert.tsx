import circuit from "@/circuits/poseidon_hash/target/poseidon_hash.json" assert { type: "json" };
import { BarretenbergBackend } from "@noir-lang/backend_barretenberg";
import { Noir } from "@noir-lang/noir_js";
import { useState } from "react";
import { useContractContext } from "./useContractContext";

const backend = new BarretenbergBackend(circuit as any);
const noir = new Noir(circuit as any, backend);

export function Insert() {
  const { contract } = useContractContext();
  const [secret, setSecret] = useState<string>("");

  async function register(secret: string) {
    if (!contract) {
      alert("Please connect first");
      return;
    }

    if (!secret) {
      alert("Please enter a secret");
      return;
    }

    await noir.init();
    const result = await noir.execute({
      secret: Buffer.from(secret).toString("hex"),
    });
    const returnValue = result.returnValue;
    const tx = await contract.register(returnValue.toString());
    await tx.wait();

    alert("Registered!");
  }

  return (
    <form>
      <label>
        Secret:
        <input
          type="text"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
        />
      </label>

      <button
        onClick={(e) => {
          e.preventDefault();
          register(secret);
        }}
      >
        Register
      </button>
    </form>
  );
}
