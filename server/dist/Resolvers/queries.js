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
const repos_1 = require("../repos");
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
            evnts = evnts.map((event) => {
                event = Object.assign(Object.assign({}, event), { start_utc: new Date(event.start_utc).toISOString(), end_utc: new Date(event.end_utc).toISOString() });
                return event;
            });
            return evnts;
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
                event = Object.assign(Object.assign({}, event), { start_utc: new Date(event.start_utc).toISOString(), end_utc: new Date(event.end_utc).toISOString() });
                return event;
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
