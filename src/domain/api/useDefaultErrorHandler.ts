import { useCallback } from 'react';
import * as Sentry from '@sentry/browser';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { ApolloError } from '@apollo/client';

function useDefaultErrorHandler() {
  useTranslation(); // Keep for future use if needed

  const defaultErrorHandler = useCallback(
    (error: Error) => {
      let errorMessage = `Error: ${error.message}`;

      // Special handling for Apollo errors
      if (error instanceof ApolloError) {
        errorMessage = 'Apollo Error: ' + error.message;

        // Add network error details if available
        if (error.networkError) {
          errorMessage += `\nNetwork Error: ${error.networkError.message || 'Failed to fetch'}`;

          // Add request URL if available
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const request = (error.networkError as any)?.request;
          if (request?.url) {
            errorMessage += `\nURL: ${request.url}`;
          }
        }

        // Add GraphQL errors if available
        if (error.graphQLErrors?.length) {
          const graphQLError = error.graphQLErrors[0];
          errorMessage += `\nGraphQL: ${graphQLError.message}`;
        }
      }

      // Show detailed error in toast
      toast.error(errorMessage, {
        autoClose: 10000, // Keep error visible longer (10s)
        position: 'top-center',
      });

      // Still log to console for debugging
      // eslint-disable-next-line no-console
      console.error('Error details:', error);

      Sentry.captureException(error);
    },
    [] // Removed 't' from dependencies as it's not used
  );

  return defaultErrorHandler;
}

export default useDefaultErrorHandler;
