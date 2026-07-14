import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import schema from "./schema";

const initializeApolloServer = (httpServer) => {
    const enablePlayground = process.env.DEBUG === "true"
    const server = new ApolloServer({
        schema: schema,
        introspection: enablePlayground,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]

    })
    return server
}
export default initializeApolloServer