"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toIsoEvent = void 0;
/**
 * Converts the stored date values of an event to ISO strings,
 * so every event response is shaped the same way.
 */
const toIsoEvent = (event) => (Object.assign(Object.assign({}, event), { start_utc: new Date(event.start_utc).toISOString(), end_utc: new Date(event.end_utc).toISOString() }));
exports.toIsoEvent = toIsoEvent;
