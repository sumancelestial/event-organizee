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
                    code: 'NOT_FOUND'
                },
            });
        });
    },
    registeredCount(parent) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield registrations_1.default.countByEvent(parent.id);
        });
    },
    spotsLeft(parent) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield registrations_1.default.spotsLeft(parent);
        });
    },
    isFull(parent) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield registrations_1.default.spotsLeft(parent)) === 0;
        });
    },
    isRegistrationClosed(parent) {
        return __awaiter(this, void 0, void 0, function* () {
            return registrations_1.default.isClosed(parent);
        });
    },
    isRegistered(parent, _, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(context === null || context === void 0 ? void 0 : context.currentUser)) {
                return false;
            }
            return yield registrations_1.default.isRegistered(parent.id, context.currentUser.id);
        });
    }
};
exports.default = event;
