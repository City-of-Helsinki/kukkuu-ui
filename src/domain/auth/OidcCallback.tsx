import React from 'react';
import { CallbackComponent } from 'redux-oidc';
import { User } from 'oidc-client';
import { RouteChildrenProps } from 'react-router';

import { formatMessage } from '../../common/translation/utils';
import userManager from './userManager';

function OidcCallback(props: RouteChildrenProps) {
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
      <p>{formatMessage('authentication.redirect.text')}</p>
    </CallbackComponent>
  );
}

export default OidcCallback;
