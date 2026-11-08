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
const repos_1 = require("../repos");
const mutations = {
    addEvent(_, args, context) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __awaiter(this, void 0, void 0, function* () {
            if (!(context === null || context === void 0 ? void 0 : context.grantAccess)) {
                return new graphql_1.GraphQLError('Unauthorized user.. Please login again!', {
                    extensions: {
                        code: 'UNAUTHORIZED',
                    }
                });
            }
            const org = yield repos_1.orgRepo.findOne({
                where: {
                    id: (_a = args === null || args === void 0 ? void 0 : args.input) === null || _a === void 0 ? void 0 : _a.orgId
                }
            });
            if (org) {
                const event = new events_1.Events();
                event.org = org;
                event.capacity = (_b = args === null || args === void 0 ? void 0 : args.input) === null || _b === void 0 ? void 0 : _b.capacity;
                event.dsc_html = (_c = args === null || args === void 0 ? void 0 : args.input) === null || _c === void 0 ? void 0 : _c.dsc_html;
                event.name_html = (_d = args === null || args === void 0 ? void 0 : args.input) === null || _d === void 0 ? void 0 : _d.name_html;
                event.dsc_text = (_e = args === null || args === void 0 ? void 0 : args.input) === null || _e === void 0 ? void 0 : _e.dsc_text;
                event.name_text = (_f = args === null || args === void 0 ? void 0 : args.input) === null || _f === void 0 ? void 0 : _f.name_text;
                event.start_utc = (_g = args === null || args === void 0 ? void 0 : args.input) === null || _g === void 0 ? void 0 : _g.start_utc;
                event.end_utc = (_h = args === null || args === void 0 ? void 0 : args.input) === null || _h === void 0 ? void 0 : _h.end_utc;
                const newEvent = yield repos_1.eventsRepo.save(event);
                if (newEvent) {
                    newEvent.start_utc = new Date(newEvent.start_utc).toISOString(),
                        newEvent.end_utc = new Date(newEvent.end_utc).toISOString();
                    return newEvent;
                }
                return new graphql_1.GraphQLError('Cannot create event at this moment.', {
                    extensions: {
                        code: 'BAD_REQUEST'
                    }
                });
            }
            return new graphql_1.GraphQLError('Organization you are looking for is not found.', {
                extensions: {
                    code: 'NOT_FOUND'
                }
            });
        });
    },
    deleteEvent(_, args, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(context === null || context === void 0 ? void 0 : context.grantAccess)) {
                return new graphql_1.GraphQLError('Unauthorized user.. Please login again!', {
                    extensions: {
                        code: 'UNAUTHORIZED',
                    }
                });
            }
            const event = yield repos_1.eventsRepo.delete(args.id);
            if (event === null || event === void 0 ? void 0 : event.affected) {
                const message = {
                    status: 'success',
                    message: 'Event deleted successfully!'
                };
                return message;
            }
            return new graphql_1.GraphQLError('Event you are looking for is not found.', {
                extensions: {
                    code: 'NOT_FOUND'
                }
            });
        });
    },
    updateEvent(_, args, context) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!(context === null || context === void 0 ? void 0 : context.grantAccess)) {
                return new graphql_1.GraphQLError('Unauthorized user.. Please login again!', {
                    extensions: {
                        code: 'UNAUTHORIZED',
                    }
                });
            }
            const updatedEvent = yield repos_1.eventsRepo.update(args.input.id, {
                name_html: args.input.name_html,
                name_text: args.input.name_text,
                dsc_html: args.input.dsc_html,
                dsc_text: args.input.dsc_text,
                capacity: args.input.capacity
            });
            if (updatedEvent === null || updatedEvent === void 0 ? void 0 : updatedEvent.affected) {
                const event = yield repos_1.eventsRepo.find({
                    where: {
                        id: args.input.id
                    }
                });
                event[0].start_utc = new Date((_a = event[0]) === null || _a === void 0 ? void 0 : _a.start_utc).toISOString();
                event[0].end_utc = new Date((_b = event[0]) === null || _b === void 0 ? void 0 : _b.end_utc).toISOString();
                return event[0];
            }
            return new graphql_1.GraphQLError('Event you are looking for is not found.', {
                extensions: {
                    code: 'NOT_FOUND'
                }
            });
        });
    }
};
exports.default = mutations;
