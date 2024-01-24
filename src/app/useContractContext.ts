import { Registrar } from "@/typechain";
import { createContext, useContext } from "react";

interface ContractContextType {
  contract?: Registrar;
}

export const ContractContext = createContext<ContractContextType>({
  contract: undefined,
});

export function useContractContext(): ContractContextType {
  return useContext(ContractContext);
}
