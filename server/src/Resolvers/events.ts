import { GraphQLError } from "graphql";
import { orgRepo } from "../repos";

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
  }
}

export default event