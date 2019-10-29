import React, { FunctionComponent } from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import { BrowserRouter } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { OidcProvider } from 'redux-oidc';
import { Provider } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router';

import App from './App';
import graphqlClient from '../graphql/client';
import enableOidcLogging from '../auth/enableOidcLogging';
import OidcCallback from '../auth/OidcCallback';
import { SUPPORT_LANGUAGES } from '../../common/translation/constants';
import store from './state/AppStore';
import userManager from '../auth/userManager';
import submitChild from '../registration/mutations/submitChild';

const localeParam = `:locale(${SUPPORT_LANGUAGES.EN}|${SUPPORT_LANGUAGES.FI}|${SUPPORT_LANGUAGES.SV})`;

if (process.env.NODE_ENV !== 'production') {
  enableOidcLogging();
}

const variables = {
  birthdate: '2019-10-11',
  firstName: 'a child',
  lastName: 'b',
  guardianLastName: 'c',
  guardianFirstName: 'd',
  email: 'e@example.com',
};

const z = graphqlClient;

z.mutate({
  mutation: submitChild,
  variables: variables,
})
  .then(result => console.log(result))
  .catch(err => console.error(err));

// Export for testing purpose
export const appRoutes = (
  <Switch>
    <Route exact path="/callback" component={OidcCallback} />
    <Redirect exact path="/" to="/fi/home" />
    <Route path={`/${localeParam}/*`} component={App} />
    <Route exact path={`/${localeParam}/callback`} component={OidcCallback} />
    <Route
      render={props => <Redirect to={`/fi${props.location.pathname}`} />}
    />
  </Switch>
);
const BrowserApp: FunctionComponent = () => {
  return (
    <Provider store={store}>
      <OidcProvider store={store} userManager={userManager}>
        <ApolloProvider client={graphqlClient}>
          <BrowserRouter>{appRoutes}</BrowserRouter>
        </ApolloProvider>
      </OidcProvider>
    </Provider>
  );
};

export default BrowserApp;
