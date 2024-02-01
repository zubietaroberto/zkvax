import { Registrar, Registrar__factory } from "@/typechain";
import { JsonRpcProvider } from "ethers/providers";
import { Wallet } from "ethers/wallet";
import { createContext, useContext, useEffect, useState } from "react";

interface ContractContextType {
  contract?: Registrar;
}

export const ContractContext = createContext<ContractContextType>({
  contract: undefined,
});

export function useContractContext(): ContractContextType {
  return useContext(ContractContext);
}

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_REGISTRAR_ADDRESS as string;
const provider = new JsonRpcProvider("http://localhost:8545");
const testSigner = new Wallet(
  process.env.NEXT_PUBLIC_TEST_PRIVATE_KEY as string,
  provider
);

export function useContract() {
  const [contract, setContract] = useState<Registrar>();

  useEffect(() => {
    async function connect() {
      const newContract = Registrar__factory.connect(
        CONTRACT_ADDRESS,
        testSigner
      );
      setContract(newContract);
    }

    connect();
  }, []);

  return contract;
}
