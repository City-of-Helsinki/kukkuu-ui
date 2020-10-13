import { useCallback } from 'react';
import * as Sentry from '@sentry/browser';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

function useDefaultErrorHandler() {
  const { t } = useTranslation();

  const defaultErrorHandler = useCallback(
    (error: Error) => {
      toast.error(t('api.errorMessage'));
      Sentry.captureException(error);
    },
    [t]
  );

  return defaultErrorHandler;
}

export default useDefaultErrorHandler;
