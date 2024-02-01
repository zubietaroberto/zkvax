import circuit from "@/circuits/poseidon_hash.json" assert { type: "json" };
import { useContractContext } from "@/components/useContractContext";
import { BarretenbergBackend } from "@noir-lang/backend_barretenberg";
import { Noir } from "@noir-lang/noir_js";
import { BN } from "bn.js";
import { useState } from "react";

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

    // TODO: Find a way to do this without BN.js
    const bytes = Buffer.from(secret).toJSON().data;
    const input = new BN(bytes, 16, "le").toString();

    // TODO: Find a way to do this without circuits
    await noir.init();
    const result = await noir.execute({ secret: input });
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
