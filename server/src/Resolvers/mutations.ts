import { GraphQLError } from "graphql";
import { Events } from "../Entities/events"
import { Registrations } from "../Entities/registrations"
import { eventsRepo, orgRepo, registrationsRepo } from "../repos"
import normalizeEvent from "../utils"

const unauthorized = () => new GraphQLError('Unauthorized user.. Please login again!', {
  extensions: {
    code: 'UNAUTHORIZED',
  }
})

const notFound = () => new GraphQLError('Event you are looking for is not found.', {
  extensions: {
    code: 'NOT_FOUND'
  }
})

const badRequest = (message: string) => new GraphQLError(message, {
  extensions: {
    code: 'BAD_REQUEST'
  }
})

const mutations = {
  async addEvent(_:any, args: any, context:any){
    if(!context?.grantAccess)
    {
      return unauthorized()
    }
    const org = await orgRepo.findOne({
      where: {
        id: args?.input?.orgId
      }
    })
    if(org)
    {
      const event = new Events();
      event.org = org;
      event.capacity = args?.input?.capacity
      event.dsc_html = args?.input?.dsc_html
      event.name_html = args?.input?.name_html
      event.dsc_text = args?.input?.dsc_text
      event.name_text = args?.input?.name_text
      event.start_utc = args?.input?.start_utc
      event.end_utc = args?.input?.end_utc

      const newEvent = await eventsRepo.save(event);
      if(newEvent)
      {
        newEvent.start_utc = new Date(newEvent.start_utc).toISOString(),
        newEvent.end_utc = new Date(newEvent.end_utc).toISOString()
        return newEvent
      }
      return new GraphQLError('Cannot create event at this moment.', {
        extensions: {
          code: 'BAD_REQUEST'
        }
      })
    }
    return new GraphQLError('Organization you are looking for is not found.', {
      extensions: {
        code: 'NOT_FOUND'
      }
    })
  },

  async deleteEvent(_:any, args:any, context:any){
    if(!context?.grantAccess)
    {
      return new GraphQLError('Unauthorized user.. Please login again!', {
        extensions: {
          code: 'UNAUTHORIZED',
        }
      })
    }
    const event = await eventsRepo.delete(args.id)
    if(event?.affected)
    {
      const message = {
        status: 'success',
        message: 'Event deleted successfully!'
      }
      return message
    }
    return new GraphQLError('Event you are looking for is not found.', {
      extensions: {
        code: 'NOT_FOUND'
      }
    })
  },

  async updateEvent(_:any,args:any, context:any) {
    if(!context?.grantAccess)
    {
      return new GraphQLError('Unauthorized user.. Please login again!', {
        extensions: {
          code: 'UNAUTHORIZED',
        }
      })
    }
    const updatedEvent =  await eventsRepo.update(args.input.id,{
      name_html: args.input.name_html,
      name_text: args.input.name_text,
      dsc_html: args.input.dsc_html,
      dsc_text: args.input.dsc_text,
      capacity: args.input.capacity
    })
    if(updatedEvent?.affected)
    {
      const event = await eventsRepo.find({
        where: {
          id: args.input.id
        }
      })
      return normalizeEvent(event[0])
    }
    return new GraphQLError('Event you are looking for is not found.', {
      extensions: {
        code: 'NOT_FOUND'
      }
    })
  },

  // A user can register only once, only before the event has ended
  // and only while there is a spot left.
  async registerForEvent(_:any, args:any, context:any){
    if(!context?.grantAccess || !context?.user)
    {
      throw unauthorized()
    }
    const event = await eventsRepo.findOne({
      where: {
        id: args.eventId
      }
    })
    if(!event)
    {
      throw notFound()
    }
    if(new Date(event.end_utc).getTime() <= Date.now())
    {
      throw badRequest('Registration is closed. This event has already ended.')
    }
    const alreadyRegistered = await registrationsRepo.findOne({
      where: {
        event: {
          id: event.id
        },
        user: {
          id: context.user.id
        }
      }
    })
    if(alreadyRegistered)
    {
      throw badRequest('You have already registered for this event.')
    }
    const registeredCount = await registrationsRepo.count({
      where: {
        event: {
          id: event.id
        }
      }
    })
    if(registeredCount >= event.capacity)
    {
      throw badRequest('This event is full. No spots left.')
    }
    const registration = new Registrations();
    registration.event = event;
    registration.user = context.user;
    try
    {
      // The unique constraint on (user, event) makes sure a double
      // registration cannot slip in, even from parallel requests.
      await registrationsRepo.save(registration);
    }
    catch(err:any)
    {
      if(err?.code === '23505' || err?.driverError?.code === '23505')
      {
        throw badRequest('You have already registered for this event.')
      }
      throw badRequest('Cannot register for this event at this moment.')
    }
    return normalizeEvent(event);
  },

  // Cancelling deletes the registration right away, so the spot is
  // available again immediately.
  async cancelRegistration(_:any, args:any, context:any){
    if(!context?.grantAccess || !context?.user)
    {
      throw unauthorized()
    }
    const event = await eventsRepo.findOne({
      where: {
        id: args.eventId
      }
    })
    if(!event)
    {
      throw notFound()
    }
    const registration = await registrationsRepo.findOne({
      where: {
        event: {
          id: event.id
        },
        user: {
          id: context.user.id
        }
      }
    })
    if(!registration)
    {
      throw badRequest('You are not registered for this event.')
    }
    await registrationsRepo.delete(registration.id)
    return normalizeEvent(event);
  }
  
}

export default mutations