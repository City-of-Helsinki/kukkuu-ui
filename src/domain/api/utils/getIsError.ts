import type { GraphQLFormattedError } from 'graphql';

function getIsError(
  graphQLError: GraphQLFormattedError,
  errorType: string
): boolean {
  return graphQLError.extensions?.code === errorType;
}

export default getIsError;
