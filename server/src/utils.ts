import { Events } from "./Entities/events";

/**
 * Converts the stored date values of an event to ISO strings,
 * so every event response is shaped the same way.
 */
export const toIsoEvent = (event: Events): Events => ({
  ...event,
  start_utc: new Date(event.start_utc).toISOString(),
  end_utc: new Date(event.end_utc).toISOString()
})
