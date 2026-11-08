"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const events_1 = require("./Entities/events");
const organizations_1 = require("./Entities/organizations");
const registrations_1 = require("./Entities/registrations");
const users_1 = require("./Entities/users");
const AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'password',
    database: 'EventOrganizee',
    entities: [events_1.Events, organizations_1.Organizations, users_1.Users, registrations_1.Registrations],
    synchronize: true,
    logging: true
});
exports.default = AppDataSource;
