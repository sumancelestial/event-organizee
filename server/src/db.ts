import { DataSource } from "typeorm";
import { Events } from "./Entities/events";
import { Organizations } from "./Entities/organizations";
import { Registrations } from "./Entities/registrations";
import { Users } from "./Entities/users";

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'EventOrganizee',
  entities: [Events, Organizations, Users, Registrations],
  synchronize: true,
  logging: true
})

export default AppDataSource;