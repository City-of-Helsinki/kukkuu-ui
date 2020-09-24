import {
  useMutation as useApolloMutation,
  DocumentNode,
  TypedDocumentNode,
  MutationHookOptions,
  OperationVariables,
} from '@apollo/client';
import * as Sentry from '@sentry/browser';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

function useMutation<TData = any, TVariables = OperationVariables>(
  mutation: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options: MutationHookOptions<TData, TVariables> & {
    useDefaultErrorHandling?: boolean;
  } = {}
) {
  const { t } = useTranslation();

  const defaultErrorHandler = (error: Error) => {
    toast.error(t('api.errorMessage'));
    Sentry.captureException(error);
  };

  const { useDefaultErrorHandling, ...apolloOptions } = options;

  return useApolloMutation<TData, TVariables>(mutation, {
    onError: useDefaultErrorHandling ? defaultErrorHandler : undefined,
    ...apolloOptions,
  });
}

export default useMutation;
