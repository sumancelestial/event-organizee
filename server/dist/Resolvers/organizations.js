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
const repos_1 = require("../repos");
const organization = {
    events(parent) {
        return __awaiter(this, void 0, void 0, function* () {
            let evnts = yield repos_1.eventsRepo.find({
                where: {
                    org: {
                        id: parent.id
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
    users(parent) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield repos_1.usersRepo.find({
                where: {
                    org: {
                        id: parent.id
                    }
                }
            });
            return users;
        });
    }
};
exports.default = organization;
