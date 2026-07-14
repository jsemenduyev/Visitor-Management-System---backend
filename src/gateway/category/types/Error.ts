import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'

const ErrorType = new GraphQLObjectType({
  name: 'ErrorType',
  fields: () => ({
    message: {
      type: new GraphQLNonNull(GraphQLString),
    },
    code: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
})
export default ErrorType
