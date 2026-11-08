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
// Registered spots are counted once per event and reused for every
// registration related field of the same event.
const getRegisteredCount = (parent) => __awaiter(void 0, void 0, void 0, function* () {
    if (parent.registeredCount === undefined) {
        parent.registeredCount = yield repos_1.registrationsRepo.count({
            where: {
                event: {
                    id: parent.id
                }
            }
        });
    }
    return parent.registeredCount;
});
const unauthorized = () => new graphql_1.GraphQLError('Unauthorized user.. Please login again!', {
    extensions: {
        code: 'UNAUTHORIZED',
    }
});
const event = {
    organization(parent) {
        return __awaiter(this, void 0, void 0, function* () {
            const org = yield repos_1.orgRepo.findOne({
                where: {
                    id: parent.orgId
                }
            });
            if (org) {
                org.created = new Date(org === null || org === void 0 ? void 0 : org.created).toISOString();
                return org;
            }
            return new graphql_1.GraphQLError('Organization you are looking for is not found.', {
                extensions: {
                    code: 'NOT_FOUND',
                },
            });
        });
    },
    registeredCount(parent) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield getRegisteredCount(parent);
        });
    },
    spotsLeft(parent) {
        return __awaiter(this, void 0, void 0, function* () {
            const registeredCount = yield getRegisteredCount(parent);
            return Math.max(parent.capacity - registeredCount, 0);
        });
    },
    isFull(parent) {
        return __awaiter(this, void 0, void 0, function* () {
            const registeredCount = yield getRegisteredCount(parent);
            return registeredCount >= parent.capacity;
        });
    },
    isRegistrationClosed(parent) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Date(parent.end_utc).getTime() <= Date.now();
        });
    },
    isRegistered(parent, _args, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(context === null || context === void 0 ? void 0 : context.user)) {
                return false;
            }
            const registration = yield repos_1.registrationsRepo.findOne({
                where: {
                    event: {
                        id: parent.id
                    },
                    user: {
                        id: context.user.id
                    }
                }
            });
            return !!registration;
        });
    },
    // Organizers view: everyone who registered for the event.
    registrations(parent, _args, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(context === null || context === void 0 ? void 0 : context.grantAccess)) {
                throw unauthorized();
            }
            return yield repos_1.registrationsRepo.find({
                where: {
                    event: {
                        id: parent.id
                    }
                },
                relations: {
                    user: true
                },
                order: {
                    id: 'DESC'
                }
            }).then((registrations) => registrations.map((registration) => (Object.assign(Object.assign({}, registration), { created: new Date(registration.created).toISOString() }))));
        });
    }
};
exports.default = event;
