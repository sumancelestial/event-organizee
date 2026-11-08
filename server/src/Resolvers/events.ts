import { GraphQLError } from "graphql";
import { orgRepo, registrationsRepo } from "../repos";

// Registered spots are counted once per event and reused for every
// registration related field of the same event.
const getRegisteredCount = async (parent: any) => {
  if (parent.registeredCount === undefined) {
    parent.registeredCount = await registrationsRepo.count({
      where: {
        event: {
          id: parent.id
        }
      }
    })
  }
  return parent.registeredCount;
}

const unauthorized = () => new GraphQLError('Unauthorized user.. Please login again!', {
  extensions: {
    code: 'UNAUTHORIZED',
  }
})

const event = {
  async organization(parent: any) {
    const org = await orgRepo.findOne({
      where: {
        id: parent.orgId
      }
    })
    if(org){
      org.created = new Date(org?.created).toISOString();
      return org;
    }
    return new GraphQLError('Organization you are looking for is not found.', {
      extensions: {
        code: 'NOT_FOUND',
      },
    });
  },

  async registeredCount(parent: any) {
    return await getRegisteredCount(parent);
  },

  async spotsLeft(parent: any) {
    const registeredCount = await getRegisteredCount(parent);
    return Math.max(parent.capacity - registeredCount, 0);
  },

  async isFull(parent: any) {
    const registeredCount = await getRegisteredCount(parent);
    return registeredCount >= parent.capacity;
  },

  async isRegistrationClosed(parent: any) {
    return new Date(parent.end_utc).getTime() <= Date.now();
  },

  async isRegistered(parent: any, _args: any, context: any) {
    if(!context?.user)
    {
      return false;
    }
    const registration = await registrationsRepo.findOne({
      where: {
        event: {
          id: parent.id
        },
        user: {
          id: context.user.id
        }
      }
    })
    return !!registration;
  },

  // Organizers view: everyone who registered for the event.
  async registrations(parent: any, _args: any, context: any) {
    if(!context?.grantAccess)
    {
      throw unauthorized();
    }
    return await registrationsRepo.find({
      where: {
        event: {
          id: parent.id
        }
      },
      relations: {
        user: true
      },
      order: {
        id: 'DESC'
      }
    }).then((registrations)=>registrations.map((registration)=>({
      ...registration,
      created: new Date(registration.created).toISOString()
    })))
  }
}

export default event
