"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Puts an event's dates in the ISO format the rest of the app (and the client) expects.
const normalizeEvent = (event) => {
    if (!event) {
        return event;
    }
    return Object.assign(Object.assign({}, event), { start_utc: new Date(event.start_utc).toISOString(), end_utc: new Date(event.end_utc).toISOString() });
};
exports.default = normalizeEvent;
