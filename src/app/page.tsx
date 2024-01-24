"use client";

import { Registrar, Registrar__factory } from "@/typechain";
import { ethers } from "ethers";
import { BrowserProvider } from "ethers/providers";
import { useEffect, useState } from "react";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function TestPage2() {
  const [signer, setSigner] = useState<ethers.Signer>();
  const [contract, setContract] = useState<Registrar>();

  async function connect() {
    if (!(window as any).ethereum) {
      alert("Please install MetaMask");
      return;
    } else {
      alert("MetaMask installed");
      const provider = new BrowserProvider((window as any).ethereum);
      const newSigner = await provider.getSigner();
      setSigner(newSigner);

      const contract = Registrar__factory.connect(CONTRACT_ADDRESS, signer);
      setContract(contract);
    }
  }

  async function test() {
    if (!contract) {
      alert("Please connect first");
      return;
    }

    const tx = await contract.zeros(1);

    debugger;
    console.log(tx);
  }

  async function register() {
    if (!contract) {
      alert("Please connect first");
      return;
    }

    const tx = await contract.register("test.eth");
    await tx.wait();

    debugger;
    console.log(tx);
  }

  return (
    <div>
      <h1>Test Page 2</h1>
      <button onClick={connect}>Connect</button>
      <button onClick={test}>Test</button>

      <form>
        <label>
          Secret:
          <input type="text" name="name" />
        </label>

        <button onClick={register}>Register</button>
      </form>
    </div>
  );
}
