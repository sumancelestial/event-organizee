"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mutations_1 = __importDefault(require("../Resolvers/mutations"));
const queries_1 = __importDefault(require("../Resolvers/queries"));
const events_1 = __importDefault(require("../Resolvers/events"));
const organizations_1 = __importDefault(require("../Resolvers/organizations"));
const users_1 = __importDefault(require("../Resolvers/users"));
const resolvers = {
    Query: queries_1.default,
    Event: events_1.default,
    Organization: organizations_1.default,
    User: users_1.default,
    Mutation: mutations_1.default
};
exports.default = resolvers;
