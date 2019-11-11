import React from 'react';
import { CallbackComponent } from 'redux-oidc';
import { User } from 'oidc-client';
import { RouteChildrenProps } from 'react-router';
import { useTranslation } from 'react-i18next';

import userManager from './userManager';

function OidcCallback(props: RouteChildrenProps) {
  const { t } = useTranslation();

  const onSuccess = (user: User) => {
    if (user.state.path) props.history.push(user.state.path);
    else props.history.push('/');
  };
  const onError = (error: object) => {
    // TODO: do something about errors
    props.history.push('/');
  };
  return (
    <CallbackComponent
      successCallback={onSuccess}
      errorCallback={onError}
      userManager={userManager}
    >
      <p>{t('authentication.redirect.text')}</p>
    </CallbackComponent>
  );
}

export default OidcCallback;
