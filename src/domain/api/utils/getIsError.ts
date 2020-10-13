import { GraphQLError } from 'graphql';

function getIsError(graphQLError: GraphQLError, errorType: string): boolean {
  return graphQLError.extensions?.code === errorType;
}

export default getIsError;
