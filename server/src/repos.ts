import AppDataSource from "./db";
import { Events } from "./Entities/events";
import { Organizations } from "./Entities/organizations";
import { Users } from "./Entities/users";

export const eventsRepo = AppDataSource.getRepository(Events)
export const orgRepo = AppDataSource.getRepository(Organizations)
export const usersRepo = AppDataSource.getRepository(Users);
