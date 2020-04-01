import React from 'react';
import { CallbackComponent } from 'redux-oidc';
import { User } from 'oidc-client';
import { RouteChildrenProps } from 'react-router';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/browser';

import userManager from './userManager';
import PageWrapper from '../app/layout/PageWrapper';

function OidcCallback(props: RouteChildrenProps) {
  const { t } = useTranslation();

  const onSuccess = (user: User) => {
    if (user.state.path) props.history.push(user.state.path);
    else props.history.replace('/profile');
  };
  const onError = (error: object) => {
    toast(t('authentication.errorMessage'), {
      type: toast.TYPE.ERROR,
    });
    // TODO: Make sure that we only send errors to Sentry that are actual
    // programming/system errors, not end users's network errors.
    Sentry.captureException(error);
  };
  return (
    <PageWrapper>
      <CallbackComponent
        successCallback={onSuccess}
        errorCallback={onError}
        userManager={userManager}
      >
        <p>{t('authentication.redirect.text')}</p>
      </CallbackComponent>
    </PageWrapper>
  );
}

export default OidcCallback;
