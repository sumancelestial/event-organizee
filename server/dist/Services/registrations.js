"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const events_1 = require("../Entities/events");
const registrations_1 = require("../Entities/registrations");
const repos_1 = require("../repos");
const utils_1 = require("../utils");
const UNIQUE_VIOLATION = '23505';
const buildError = (message, code) => new graphql_1.GraphQLError(message, {
    extensions: {
        code: code
    }
});
const isUniqueViolation = (err) => {
    var _a;
    const pgError = err;
    return (pgError === null || pgError === void 0 ? void 0 : pgError.code) === UNIQUE_VIOLATION || ((_a = pgError === null || pgError === void 0 ? void 0 : pgError.driverError) === null || _a === void 0 ? void 0 : _a.code) === UNIQUE_VIOLATION;
};
/**
 * Holds the business logic behind event registrations.
 * Resolvers stay limited to parsing the request and shaping the response.
 */
class RegistrationsService {
    countByEvent(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield repos_1.registrationsRepo.count({
                where: {
                    event: {
                        id: eventId
                    }
                }
            });
        });
    }
    spotsLeft(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const taken = yield this.countByEvent(event.id);
            return Math.max(event.capacity - taken, 0);
        });
    }
    isRegistered(eventId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const registered = yield repos_1.registrationsRepo.count({
                where: {
                    event: {
                        id: eventId
                    },
                    user: {
                        id: userId
                    }
                }
            });
            return registered > 0;
        });
    }
    /**
     * Registration stays open until the event has ended.
     */
    isClosed(event) {
        return new Date(event.end_utc).getTime() <= Date.now();
    }
    listByEvent(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            const registrations = yield repos_1.registrationsRepo.find({
                where: {
                    event: {
                        id: eventId
                    }
                },
                relations: {
                    user: true
                },
                order: {
                    created: 'ASC'
                }
            });
            return registrations.map((registration) => (Object.assign(Object.assign({}, registration), { created: new Date(registration.created).toISOString() })));
        });
    }
    /**
     * Only the organizers of the event's organization can see the attendee list.
     */
    listForOrganizer(eventId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const event = yield repos_1.eventsRepo.findOne({
                where: {
                    id: eventId
                },
                relations: {
                    org: true
                }
            });
            if (!event) {
                throw buildError('Event you are looking for is not found.', 'NOT_FOUND');
            }
            const user = yield repos_1.usersRepo.findOne({
                where: {
                    id: userId
                },
                relations: {
                    org: true
                }
            });
            if (!user || ((_a = event.org) === null || _a === void 0 ? void 0 : _a.id) !== ((_b = user.org) === null || _b === void 0 ? void 0 : _b.id)) {
                throw buildError('You are not allowed to view registrations for this event.', 'UNAUTHORIZED');
            }
            return yield this.listByEvent(eventId);
        });
    }
    listEventsByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const registrations = yield repos_1.registrationsRepo.find({
                where: {
                    user: {
                        id: userId
                    }
                },
                relations: {
                    event: true
                },
                order: {
                    created: 'DESC'
                }
            });
            return registrations
                .filter((registration) => !!registration.event)
                .map((registration) => (0, utils_1.toIsoEvent)(registration.event));
        });
    }
    /**
     * Registers the user for the event inside a transaction, so that the event
     * cannot be overbooked and a user cannot register twice.
     */
    register(event, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isClosed(event)) {
                throw buildError('Registration is closed. This event has already ended.', 'REGISTRATION_CLOSED');
            }
            yield repos_1.registrationsRepo.manager.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const openEvent = yield manager.findOne(events_1.Events, {
                    where: {
                        id: event.id
                    },
                    lock: {
                        mode: 'pessimistic_write'
                    }
                });
                if (!openEvent) {
                    throw buildError('Event you are looking for is not found.', 'NOT_FOUND');
                }
                if (this.isClosed(openEvent)) {
                    throw buildError('Registration is closed. This event has already ended.', 'REGISTRATION_CLOSED');
                }
                const alreadyRegistered = yield manager.findOne(registrations_1.Registrations, {
                    where: {
                        event: {
                            id: openEvent.id
                        },
                        user: {
                            id: user.id
                        }
                    }
                });
                if (alreadyRegistered) {
                    throw buildError('You have already registered for this event.', 'ALREADY_REGISTERED');
                }
                const taken = yield manager.count(registrations_1.Registrations, {
                    where: {
                        event: {
                            id: openEvent.id
                        }
                    }
                });
                if (taken >= openEvent.capacity) {
                    throw buildError('Event is full. No spots are left.', 'EVENT_FULL');
                }
                const registration = new registrations_1.Registrations();
                registration.event = openEvent;
                registration.user = user;
                try {
                    yield manager.save(registration);
                }
                catch (err) {
                    if (isUniqueViolation(err)) {
                        throw buildError('You have already registered for this event.', 'ALREADY_REGISTERED');
                    }
                    throw err;
                }
            }));
        });
    }
    /**
     * Cancels the registration, which frees the spot straight away.
     */
    cancel(eventId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const registration = yield repos_1.registrationsRepo.findOne({
                where: {
                    event: {
                        id: eventId
                    },
                    user: {
                        id: userId
                    }
                }
            });
            if (!registration) {
                throw buildError('You are not registered for this event.', 'NOT_FOUND');
            }
            const removed = yield repos_1.registrationsRepo.delete({
                id: registration.id
            });
            if (!(removed === null || removed === void 0 ? void 0 : removed.affected)) {
                throw buildError('You are not registered for this event.', 'NOT_FOUND');
            }
        });
    }
}
exports.default = new RegistrationsService();
