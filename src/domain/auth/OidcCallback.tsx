import React, { useState } from 'react';
import { CallbackComponent } from 'redux-oidc';
import { User } from 'oidc-client';
import { RouteChildrenProps } from 'react-router';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/browser';

import ErrorMessage from '../../common/components/error/Error';
import PageWrapper from '../app/layout/PageWrapper';
import { store } from '../app/state/AppStore';
import { authenticateWithBackend } from '../auth/authenticate';
import userManager from './userManager';

function OidcCallback(props: RouteChildrenProps) {
  const { t } = useTranslation();

  const [callbackMessage, setCallbackMessage] = useState({
    message: <p>{t('authentication.redirect.text')}</p>,
  });

  const onSuccess = async (user: User) => {
    await authenticateWithBackend(user.access_token, store.dispatch);

    if (user.state.path) props.history.replace(user.state.path);
    else props.history.replace('/profile');
  };

  const onError = async (error: Error) => {
    let message = <ErrorMessage message={t('authentication.errorMessage')} />;
    let shortMessage = t('authentication.errorMessage');

    // Handle error caused by device time being more than 5 minutes off:
    if (
      error.message.includes('iat is in the future') ||
      error.message.includes('exp is in the past')
    ) {
      message = (
        <ErrorMessage message={t('authentication.deviceTimeError.message')} />
      );
      shortMessage = t('authentication.deviceTimeError.shortMessage');
    } else if (
      // Handle error caused by end user choosing Deny in Tunnistamo's Permission Request:
      // We could send an event to Analytics for this.
      error.message ===
      'The resource owner or authorization server denied the request'
    ) {
      message = (
        <ErrorMessage message={t('authentication.permRequestDenied.message')} />
      );
      shortMessage = t('authentication.permRequestDenied.shortMessage');
    } else if (error.message === 'No matching state found in storage') {
      // This error message has persisted and we haven't been able to
      // pinpoint a clear cause. Our current hypothesis is that users
      // go back to Tunnistamo and login again. When this happens
      // Tunnistamo reuses the state parameter that has already been
      // consumed and therefore no state can be found.

      // In order to test the hypothesis, we are letting Sentry know
      // whether OIDC already knws about a user. If a user exists then
      // it's likely that the root issue is something relating to this
      // interaction. We are using a tag to make it easy to see how many
      // instances of this error have or do not have a user.
      try {
        const user = await userManager.getUser();

        Sentry.withScope((scope) => {
          scope.setTag('oidc.user.exists', String(user !== null));
          Sentry.captureException(error);
        });
      } catch (e) {
        Sentry.withScope((scope) => {
          scope.setExtra('oidc.user.exists', 'unknown');
          Sentry.captureException(error);
        });
      }
    } else {
      // Send other errors to Sentry for analysis - they might be bugs:
      Sentry.captureException(error);
    }

    setCallbackMessage({ message });
    toast.error(shortMessage);
  };

  return (
    <PageWrapper>
      <CallbackComponent
        successCallback={onSuccess}
        errorCallback={onError}
        userManager={userManager}
      >
        {callbackMessage.message}
      </CallbackComponent>
    </PageWrapper>
  );
}

export default OidcCallback;
