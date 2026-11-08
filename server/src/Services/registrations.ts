import { GraphQLError } from "graphql";
import { Events } from "../Entities/events";
import { Registrations } from "../Entities/registrations";
import { Users } from "../Entities/users";
import { eventsRepo, registrationsRepo, usersRepo } from "../repos";
import { toIsoEvent } from "../utils";

const UNIQUE_VIOLATION = '23505';

const buildError = (message: string, code: string): GraphQLError => new GraphQLError(message, {
  extensions: {
    code: code
  }
})

const isUniqueViolation = (err: unknown): boolean => {
  const pgError = err as { code?: string, driverError?: { code?: string } }
  return pgError?.code === UNIQUE_VIOLATION || pgError?.driverError?.code === UNIQUE_VIOLATION;
}

/**
 * Holds the business logic behind event registrations.
 * Resolvers stay limited to parsing the request and shaping the response.
 */
class RegistrationsService {

  async countByEvent(eventId: number): Promise<number> {
    return await registrationsRepo.count({
      where: {
        event: {
          id: eventId
        }
      }
    })
  }

  async spotsLeft(event: Events): Promise<number> {
    const taken = await this.countByEvent(event.id);
    return Math.max(event.capacity - taken, 0);
  }

  async isRegistered(eventId: number, userId: number): Promise<boolean> {
    const registered = await registrationsRepo.count({
      where: {
        event: {
          id: eventId
        },
        user: {
          id: userId
        }
      }
    })
    return registered > 0;
  }

  /**
   * Registration stays open until the event has ended.
   */
  isClosed(event: Events): boolean {
    return new Date(event.end_utc).getTime() <= Date.now();
  }

  async listByEvent(eventId: number): Promise<Registrations[]> {
    const registrations = await registrationsRepo.find({
      where: {
        event: {
          id: eventId
        }
      },
      relations: {
        user: true
      },
      order: {
        created: 'ASC'
      }
    })
    return registrations.map((registration) => ({
      ...registration,
      created: new Date(registration.created).toISOString()
    }))
  }

  /**
   * Only the organizers of the event's organization can see the attendee list.
   */
  async listForOrganizer(eventId: number, userId: number): Promise<Registrations[]> {
    const event = await eventsRepo.findOne({
      where: {
        id: eventId
      },
      relations: {
        org: true
      }
    })
    if (!event) {
      throw buildError('Event you are looking for is not found.', 'NOT_FOUND');
    }
    const user = await usersRepo.findOne({
      where: {
        id: userId
      },
      relations: {
        org: true
      }
    })
    if (!user || event.org?.id !== user.org?.id) {
      throw buildError('You are not allowed to view registrations for this event.', 'UNAUTHORIZED');
    }
    return await this.listByEvent(eventId);
  }

  async listEventsByUser(userId: number): Promise<Events[]> {
    const registrations = await registrationsRepo.find({
      where: {
        user: {
          id: userId
        }
      },
      relations: {
        event: true
      },
      order: {
        created: 'DESC'
      }
    })
    return registrations
      .filter((registration) => !!registration.event)
      .map((registration) => toIsoEvent(registration.event));
  }

  /**
   * Registers the user for the event inside a transaction, so that the event
   * cannot be overbooked and a user cannot register twice.
   */
  async register(event: Events, user: Users): Promise<void> {
    if (this.isClosed(event)) {
      throw buildError('Registration is closed. This event has already ended.', 'REGISTRATION_CLOSED');
    }
    await registrationsRepo.manager.transaction(async (manager) => {
      const openEvent = await manager.findOne(Events, {
        where: {
          id: event.id
        },
        lock: {
          mode: 'pessimistic_write'
        }
      })
      if (!openEvent) {
        throw buildError('Event you are looking for is not found.', 'NOT_FOUND');
      }
      if (this.isClosed(openEvent)) {
        throw buildError('Registration is closed. This event has already ended.', 'REGISTRATION_CLOSED');
      }
      const alreadyRegistered = await manager.findOne(Registrations, {
        where: {
          event: {
            id: openEvent.id
          },
          user: {
            id: user.id
          }
        }
      })
      if (alreadyRegistered) {
        throw buildError('You have already registered for this event.', 'ALREADY_REGISTERED');
      }
      const taken = await manager.count(Registrations, {
        where: {
          event: {
            id: openEvent.id
          }
        }
      })
      if (taken >= openEvent.capacity) {
        throw buildError('Event is full. No spots are left.', 'EVENT_FULL');
      }
      const registration = new Registrations();
      registration.event = openEvent;
      registration.user = user;
      try {
        await manager.save(registration);
      }
      catch (err) {
        if (isUniqueViolation(err)) {
          throw buildError('You have already registered for this event.', 'ALREADY_REGISTERED');
        }
        throw err;
      }
    })
  }

  /**
   * Cancels the registration, which frees the spot straight away.
   */
  async cancel(eventId: number, userId: number): Promise<void> {
    const registration = await registrationsRepo.findOne({
      where: {
        event: {
          id: eventId
        },
        user: {
          id: userId
        }
      }
    })
    if (!registration) {
      throw buildError('You are not registered for this event.', 'NOT_FOUND');
    }
    const removed = await registrationsRepo.delete({
      id: registration.id
    })
    if (!removed?.affected) {
      throw buildError('You are not registered for this event.', 'NOT_FOUND');
    }
  }
}

export default new RegistrationsService();
