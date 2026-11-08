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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const repos_1 = require("../repos");
const registrations_1 = __importDefault(require("../Services/registrations"));
const utils_1 = require("../utils");
const queries = {
    events(_, args, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(context === null || context === void 0 ? void 0 : context.grantAccess)) {
                return new graphql_1.GraphQLError('Unauthorized user.. Please login again!', {
                    extensions: {
                        code: 'UNAUTHORIZED',
                    }
                });
            }
            let evnts = yield repos_1.eventsRepo.find({
                where: {
                    org: {
                        id: args.orgId
                    }
                }
            });
            evnts = evnts.map(utils_1.toIsoEvent);
            return evnts;
        });
    },
    myRegistrations(_, __, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(context === null || context === void 0 ? void 0 : context.grantAccess) || !(context === null || context === void 0 ? void 0 : context.currentUser)) {
                throw new graphql_1.GraphQLError('Unauthorized user.. Please login again!', {
                    extensions: {
                        code: 'UNAUTHORIZED',
                    }
                });
            }
            return yield registrations_1.default.listEventsByUser(context.currentUser.id);
        });
    },
    eventRegistrations(_, args, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(context === null || context === void 0 ? void 0 : context.grantAccess) || !(context === null || context === void 0 ? void 0 : context.currentUser)) {
                throw new graphql_1.GraphQLError('Unauthorized user.. Please login again!', {
                    extensions: {
                        code: 'UNAUTHORIZED',
                    }
                });
            }
            return yield registrations_1.default.listForOrganizer(args.eventId, context.currentUser.id);
        });
    },
    event(_, args, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(context === null || context === void 0 ? void 0 : context.grantAccess)) {
                return new graphql_1.GraphQLError('Unauthorized user.. Please login again!', {
                    extensions: {
                        code: 'UNAUTHORIZED',
                    }
                });
            }
            let event = yield repos_1.eventsRepo.findOne({
                where: {
                    id: args.id,
                }
            });
            if (event) {
                return (0, utils_1.toIsoEvent)(event);
            }
            return new graphql_1.GraphQLError('Event you are looking for is not found.', {
                extensions: {
                    code: 'NOT_FOUND'
                },
            });
        });
    },
    user(_, args) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield repos_1.usersRepo.findOne({
                where: {
                    token: args.token
                }
            });
        });
    }
};
exports.default = queries;
