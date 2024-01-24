import { on } from "events";
import { useState } from "react";

interface InsertProps {
  onRegister(secret: string): void;
}

export function Insert({ onRegister }: InsertProps) {
  const [secret, setSecret] = useState<string>("");

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
          onRegister(secret);
        }}
      >
        Register
      </button>
    </form>
  );
}
