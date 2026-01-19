import {
  useMutation as useApolloMutation,
  DocumentNode,
  TypedDocumentNode,
  MutationHookOptions,
  OperationVariables,
} from '@apollo/client';

import useDefaultErrorHandler from './useDefaultErrorHandler';
import graphqlClient from './client';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useMutation<TData = any, TVariables = OperationVariables>(
  mutation: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options: MutationHookOptions<TData, TVariables> & {
    useDefaultErrorHandling?: boolean;
  } = {}
) {
  const defaultErrorHandler = useDefaultErrorHandler();

  const { useDefaultErrorHandling, ...apolloOptions } = options;

  return useApolloMutation<TData, TVariables>(mutation, {
    client: graphqlClient,
    onError: useDefaultErrorHandling ? defaultErrorHandler : undefined,
    ...apolloOptions,
  });
}

export default useMutation;
