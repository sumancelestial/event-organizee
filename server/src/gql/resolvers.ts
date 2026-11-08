import mutations from "../Resolvers/mutations";
import queries from "../Resolvers/queries";
import event from "../Resolvers/events";
import organization from "../Resolvers/organizations";
import user from "../Resolvers/users";

const resolvers = {
  Query: queries,
  Event: event,
  Organization: organization,
  User: user,
  Mutation: mutations
}

export default resolvers