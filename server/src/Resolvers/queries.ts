import { GraphQLError } from "graphql";
import { eventsRepo, orgRepo, usersRepo } from "../repos";

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
  }
};

export default queries