import { useEffect, useState } from "react";
import { useContractContext } from "../components/useContractContext";
import { Registrar } from "@/typechain";

export interface RegistrationEvent {
  commitment: string;
  leafIndex: number;
  timestamp: bigint;
}

export async function getRegistrationEvents(
  contract: Registrar
): Promise<RegistrationEvent[]> {
  const filter = contract.filters.Registration();
  const events = await contract.queryFilter(filter);

  const parsed: RegistrationEvent[] = events.map((event) => {
    const { commitment, leafIndex, timestamp } = event.args;
    return { commitment, leafIndex: Number(leafIndex), timestamp };
  });

  return parsed;
}

export function useRegistrationEvents() {
  const [events, setEvents] = useState<RegistrationEvent[]>([]);
  const { contract } = useContractContext();

  useEffect(() => {
    if (!contract) return;
    getRegistrationEvents(contract).then((result) => setEvents(result));
  }, [contract]);

  return { events, getRegistrationEvents };
}
