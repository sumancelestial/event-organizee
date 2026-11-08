import { GraphQLError } from "graphql";
import { eventsRepo, orgRepo, usersRepo } from "../repos";
import registrationsService from "../Services/registrations";
import { toIsoEvent } from "../utils";

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
    evnts = evnts.map(toIsoEvent)
    return evnts
  },

  async myRegistrations(_: any, __: any, context:any) {
    if(!context?.grantAccess || !context?.currentUser)
    {
      throw new GraphQLError('Unauthorized user.. Please login again!', {
        extensions: {
          code: 'UNAUTHORIZED',
        }
      })
    }
    return await registrationsService.listEventsByUser(context.currentUser.id)
  },

  async eventRegistrations(_: any, args: any, context:any) {
    if(!context?.grantAccess || !context?.currentUser)
    {
      throw new GraphQLError('Unauthorized user.. Please login again!', {
        extensions: {
          code: 'UNAUTHORIZED',
        }
      })
    }
    return await registrationsService.listForOrganizer(args.eventId, context.currentUser.id)
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
      return toIsoEvent(event)
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
  }
};

export default queries
