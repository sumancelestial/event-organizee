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
const user = {
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
    }
};
exports.default = user;
