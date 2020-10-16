import {
  useMutation as useApolloMutation,
  DocumentNode,
  TypedDocumentNode,
  MutationHookOptions,
  OperationVariables,
} from '@apollo/client';

import useDefaultErrorHandler from './useDefaultErrorHandler';

function useMutation<TData = any, TVariables = OperationVariables>(
  mutation: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options: MutationHookOptions<TData, TVariables> & {
    useDefaultErrorHandling?: boolean;
  } = {}
) {
  const defaultErrorHandler = useDefaultErrorHandler();

  const { useDefaultErrorHandling, ...apolloOptions } = options;

  return useApolloMutation<TData, TVariables>(mutation, {
    onError: useDefaultErrorHandling ? defaultErrorHandler : undefined,
    ...apolloOptions,
  });
}

export default useMutation;
