import { GraphQLError } from "graphql";
import { eventsRepo, orgRepo, registrationsRepo, usersRepo } from "../repos";
import normalizeEvent from "../utils";

const unauthorized = () => new GraphQLError('Unauthorized user.. Please login again!', {
  extensions: {
    code: 'UNAUTHORIZED',
  }
})

const queries = {
  async events(_: any, args: any, context:any) {
    if(!context?.grantAccess)
    {
      return new GraphQLError('Unauthorized user.. Please login again!', {
        extensions: {
          code: 'UNAUTHORIZED',
        }
      })
    }
    let evnts = await eventsRepo.find({
      where: {
        org: {
          id: args.orgId
        }
      }
    });
    evnts = evnts.map((event)=>{
      event = {
        ...event,
        start_utc: new Date(event.start_utc).toISOString(),
        end_utc: new Date(event.end_utc).toISOString(),
      }
      return event
    })
    return evnts
  },
  
  async event(_:any, args: any, context:any)
  {
    if(!context?.grantAccess)
    {
      return new GraphQLError('Unauthorized user.. Please login again!', {
        extensions: {
          code: 'UNAUTHORIZED',
        }
      })
    }
    let event = await eventsRepo.findOne({
      where: {
        id: args.id,
      }
    })
    if(event){
      event = {
        ...event,
        start_utc: new Date(event.start_utc).toISOString(),
        end_utc: new Date(event.end_utc).toISOString(),
      }
      return event
    }
    return new GraphQLError('Event you are looking for is not found.', {
      extensions: {
        code: 'NOT_FOUND'
      },
    });
  },
  
  async user(_:any, args: any) {
    return await usersRepo.findOne({
      where: {
        token: args.token
      }
    })
  },

  // Events the logged in user has registered for.
  async myRegistrations(_:any, __:any, context:any) {
    if(!context?.grantAccess || !context?.user)
    {
      throw unauthorized()
    }
    const registrations = await registrationsRepo.find({
      where: {
        user: {
          id: context.user.id
        }
      },
      relations: {
        event: true
      },
      order: {
        id: 'DESC'
      }
    })
    return registrations
      .filter((registration)=>!!registration.event)
      .map((registration)=>normalizeEvent(registration.event))
  },

  // Organizers view: everyone who registered for an event.
  async eventRegistrations(_:any, args: any, context:any) {
    if(!context?.grantAccess)
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
      throw new GraphQLError('Event you are looking for is not found.', {
        extensions: {
          code: 'NOT_FOUND'
        }
      })
    }
    const registrations = await registrationsRepo.find({
      where: {
        event: {
          id: event.id
        }
      },
      relations: {
        user: true
      },
      order: {
        id: 'DESC'
      }
    })
    return registrations.map((registration)=>({
      ...registration,
      created: new Date(registration.created).toISOString()
    }))
  }
};

export default queries