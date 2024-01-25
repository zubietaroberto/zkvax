import { keccak256 } from "ethers/crypto";
import { useState } from "react";
import { useContractContext } from "./useContractContext";

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

    const hash = keccak256(Buffer.from(secret));
    const tx = await contract.register(hash);
    await tx.wait();
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
