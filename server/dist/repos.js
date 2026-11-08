"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRepo = exports.orgRepo = exports.eventsRepo = void 0;
const db_1 = __importDefault(require("./db"));
const events_1 = require("./Entities/events");
const organizations_1 = require("./Entities/organizations");
const users_1 = require("./Entities/users");
exports.eventsRepo = db_1.default.getRepository(events_1.Events);
exports.orgRepo = db_1.default.getRepository(organizations_1.Organizations);
exports.usersRepo = db_1.default.getRepository(users_1.Users);
