import {
  useQuery as useApolloQuery,
  DocumentNode,
  TypedDocumentNode,
  MutationHookOptions,
  OperationVariables,
} from '@apollo/client';

import useDefaultErrorHandler from './useDefaultErrorHandler';

function useQuery<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TData = any,
  TVariables extends OperationVariables = OperationVariables,
>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options: MutationHookOptions<TData, TVariables> & {
    useDefaultErrorHandling?: boolean;
  } = {}
) {
  const defaultErrorHandler = useDefaultErrorHandler();

  const { useDefaultErrorHandling, ...apolloOptions } = options;

  return useApolloQuery<TData, TVariables>(query, {
    onError: useDefaultErrorHandling ? defaultErrorHandler : undefined,
    ...apolloOptions,
  });
}

export default useQuery;
