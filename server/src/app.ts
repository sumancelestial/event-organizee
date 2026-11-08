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
      const verifyToken = await usersRepo.findOne({
        where: {
          token: req?.headers?.token
        }
      })
      if(verifyToken)
      {
        return {
          grantAccess: true,
        }
      }
      return {
        grantAccess: false,
      }
    }
  })
  console.log('Server at', url);
})
.catch((err)=>{
  console.log(err)
})


