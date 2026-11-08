import { ApolloServer } from "@apollo/server";
import typeDefs from "./gql/schema";
import resolvers from "./gql/resolvers";
import AppDataSource from "./db";
import { startStandaloneServer } from '@apollo/server/standalone';
import { usersRepo } from "./repos";

const server = new ApolloServer({
  typeDefs,
  resolvers
})

AppDataSource.initialize().then(async ()=>{
  const {url} = await startStandaloneServer(server,{
    listen: {
      port: 4000
    },
    context: async ({req,res}:any)=>{
      const requestToken = req?.headers?.token;
      // An undefined token must not be treated as a condition, otherwise
      // every anonymous request would be matched against the first user.
      if(!requestToken)
      {
        return {
          grantAccess: false,
          user: null,
        }
      }
      const verifyToken = await usersRepo.findOne({
        where: {
          token: requestToken
        }
      })
      if(verifyToken)
      {
        return {
          grantAccess: true,
          user: verifyToken,
        }
      }
      return {
        grantAccess: false,
        user: null,
      }
    }
  })
  console.log('Server at', url);
})
.catch((err)=>{
  console.log(err)
})


