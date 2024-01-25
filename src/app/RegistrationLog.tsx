import { useEffect, useState } from "react";
import { useContractContext } from "./useContractContext";

interface RegistrationEvent {
  commitment: string;
  leafIndex: bigint;
  timestamp: bigint;
}

export function RegistrationLog() {
  const { contract } = useContractContext();
  const [events, setEvents] = useState<RegistrationEvent[]>([]);

  async function getRegistrationEvents() {
    if (!contract) return;

    const filter = contract.filters.Registration();
    const events = await contract.queryFilter(filter);

    const parsed: RegistrationEvent[] = events.map((event) => {
      const { commitment, leafIndex, timestamp } = event.args;
      return { commitment, leafIndex, timestamp };
    });
    setEvents(parsed);
  }

  useEffect(() => {
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
              {event.commitment} @ index #{event.leafIndex.toString()} (
              {event.timestamp.toString()})
            </li>
          ))
        )}
      </ol>

      <button
        onClick={(e) => {
          e.preventDefault();
          getRegistrationEvents();
        }}
      >
        Refresh
      </button>
    </div>
  );
}
