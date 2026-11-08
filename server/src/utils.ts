import { Events } from "./Entities/events";

// Puts an event's dates in the ISO format the rest of the app (and the client) expects.
const normalizeEvent = (event: Events) => {
  if (!event) {
    return event;
  }
  return {
    ...event,
    start_utc: new Date(event.start_utc).toISOString(),
    end_utc: new Date(event.end_utc).toISOString(),
  };
};

export default normalizeEvent;
