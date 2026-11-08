import { GraphQLError } from "graphql";
import { Events } from "../Entities/events"
import { eventsRepo, orgRepo } from "../repos"

const mutations = {
  async addEvent(_:any, args: any, context:any){
    if(!context?.grantAccess)
    {
      return new GraphQLError('Unauthorized user.. Please login again!', {
        extensions: {
          code: 'UNAUTHORIZED',
        }
      })
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
      event[0].start_utc = new Date(event[0]?.start_utc).toISOString()
      event[0].end_utc = new Date(event[0]?.end_utc).toISOString()
      return event[0]
    }
    return new GraphQLError('Event you are looking for is not found.', {
      extensions: {
        code: 'NOT_FOUND'
      }
    })
  }
  
}

export default mutations