import {
  useMutation as useApolloMutation,
  DocumentNode,
  TypedDocumentNode,
  MutationHookOptions,
  OperationVariables,
} from '@apollo/client';

import useDefaultErrorHandler from './useDefaultErrorHandler';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useMutation<TData = any, TVariables = OperationVariables>(
  mutation: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options: MutationHookOptions<TData, TVariables> & {
    useDefaultErrorHandling?: boolean;
  } = {}
) {
  const defaultErrorHandler = useDefaultErrorHandler();

  const { useDefaultErrorHandling, ...apolloOptions } = options;

  // Testing
  return useApolloMutation<TData, TVariables>(mutation, {
    onError: useDefaultErrorHandling ? defaultErrorHandler : undefined,
    ...apolloOptions,
  });
}

export default useMutation;
