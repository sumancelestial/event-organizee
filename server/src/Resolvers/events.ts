import { GraphQLError } from "graphql";
import { orgRepo } from "../repos";
import registrationsService from "../Services/registrations";

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
        code: 'NOT_FOUND'
      },
    });
  },

  async registeredCount(parent: any) {
    return await registrationsService.countByEvent(parent.id);
  },

  async spotsLeft(parent: any) {
    return await registrationsService.spotsLeft(parent);
  },

  async isFull(parent: any) {
    return (await registrationsService.spotsLeft(parent)) === 0;
  },

  async isRegistrationClosed(parent: any) {
    return registrationsService.isClosed(parent);
  },

  async isRegistered(parent: any, _: any, context: any) {
    if(!context?.currentUser)
    {
      return false;
    }
    return await registrationsService.isRegistered(parent.id, context.currentUser.id);
  }
}

export default event
