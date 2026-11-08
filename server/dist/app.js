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
const server_1 = require("@apollo/server");
const schema_1 = __importDefault(require("./gql/schema"));
const resolvers_1 = __importDefault(require("./gql/resolvers"));
const db_1 = __importDefault(require("./db"));
const standalone_1 = require("@apollo/server/standalone");
const repos_1 = require("./repos");
const server = new server_1.ApolloServer({
    typeDefs: schema_1.default,
    resolvers: resolvers_1.default
});
db_1.default.initialize().then(() => __awaiter(void 0, void 0, void 0, function* () {
    const { url } = yield (0, standalone_1.startStandaloneServer)(server, {
        listen: {
            port: 4000
        },
        context: (_a) => __awaiter(void 0, [_a], void 0, function* ({ req }) {
            var _b;
            const token = (_b = req === null || req === void 0 ? void 0 : req.headers) === null || _b === void 0 ? void 0 : _b.token;
            const currentUser = token ? yield repos_1.usersRepo.findOne({
                where: {
                    token: token
                }
            }) : null;
            if (currentUser) {
                return {
                    grantAccess: true,
                    currentUser: currentUser,
                };
            }
            return {
                grantAccess: false,
                currentUser: null,
            };
        })
    });
    console.log('Server at', url);
}))
    .catch((err) => {
    console.log(err);
});
