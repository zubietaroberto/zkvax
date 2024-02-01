import { useRegistrationEvents } from "@/components/useRegistrationEvents";
import styles from "./index.module.css";
import { PropsWithChildren } from "react";

function Empty({ children }: PropsWithChildren) {
  return <>{children}</>;
}

function parseDateFromUnix(unix: bigint) {
  return new Date(Number(unix * 1000n)).toLocaleString();
}

export function RegistrationLog() {
  const { events } = useRegistrationEvents();

  return (
    <div>
      <h2>Registration Log</h2>
      <section className={styles.log}>
        {events.length < 1 ? (
          <div>No events</div>
        ) : (
          events.map((event, i) => (
            <Empty key={i}>
              <div className="index">#{event.leafIndex.toString()}</div>
              <div className="time">({parseDateFromUnix(event.timestamp)})</div>
              <div className="commitment">{event.commitment}</div>
            </Empty>
          ))
        )}
      </section>
    </div>
  );
}
