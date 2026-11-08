import AppDataSource from "./db";
import { Events } from "./Entities/events";
import { Organizations } from "./Entities/organizations";
import { Registrations } from "./Entities/registrations";
import { Users } from "./Entities/users";

export const eventsRepo = AppDataSource.getRepository(Events)
export const orgRepo = AppDataSource.getRepository(Organizations)
export const usersRepo = AppDataSource.getRepository(Users);
export const registrationsRepo = AppDataSource.getRepository(Registrations);
