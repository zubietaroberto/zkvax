import { useEffect, useState } from "react";
import { useContractContext } from "./useContractContext";
import { EventLog } from "ethers";

interface RegistrationEvent {
  commitment: string;
  blockNumber: number;
  timestamp: bigint;
}

export function RegistrationLog() {
  const { contract } = useContractContext();
  const [events, setEvents] = useState<RegistrationEvent[]>([]);

  useEffect(() => {
    async function getRegistrationEvents() {
      if (!contract) return;

      const filter = contract.filters.Registration();
      const events = await contract.queryFilter(filter);

      const parsed: RegistrationEvent[] = events.map((event) => {
        const { commitment, blockNumber, timestamp } =
          event.args as any as EventLog["args"];
        return { commitment, blockNumber, timestamp };
      });
      setEvents(parsed);
    }

    getRegistrationEvents();
  }, [contract]);

  return (
    <div>
      <h2>Registration Log</h2>
      <ol>
        {events.length < 1 ? (
          <div>No events</div>
        ) : (
          events.map((event, i) => (
            <li key={i}>
              {event.commitment} @ {event.blockNumber} (
              {event.timestamp.toString()})
            </li>
          ))
        )}
      </ol>
    </div>
  );
}
