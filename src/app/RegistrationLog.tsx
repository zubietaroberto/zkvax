import { useContractContext } from "./useContractContext";
import { useRegistrationEvents } from "./useRegistrationEvents";

export function RegistrationLog() {
  const { contract } = useContractContext();
  const { events, getRegistrationEvents } = useRegistrationEvents();

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
          if (contract) getRegistrationEvents(contract);
        }}
      >
        Refresh
      </button>
    </div>
  );
}
