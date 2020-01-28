import { RetryLink } from 'apollo-link-retry';
import { setContext } from 'apollo-link-context';
import ApolloClient from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';

import { TUNNISTAMO_API_TOKEN_ENDPOINT } from './constants/ApiConstants';
import { fetchTokenSuccess } from '../auth/state/BackendAuthenticationActions';
import { apiTokenSelector } from '../auth/state/AuthenticationSelectors';
import { store } from '../app/state/AppStore';

// action which happens on relevant error
const recoveryLink = new RetryLink({
  delay: {
    initial: 0,
  },
  attempts: {
    max: 2,
    retryIf: error => {
      if (error.statusCode === 401) {
        return new Promise(resolve => {
          fetch(TUNNISTAMO_API_TOKEN_ENDPOINT)
            .then(response => response.json())
            .then(data => {
              fetchTokenSuccess(data);
              resolve(true);
            })
            .catch(() => {
              resolve(false);
            });
        });
      }
      return false;
    },
  },
});

const enrichLink = setContext((_, { headers }) => {
  const token = apiTokenSelector(store.getState());
  return {
    headers: {
      ...headers,
      Authorization: token ? token : '',
    },
  };
});

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_API_URI,
  credentials: 'omit',
});

export default new ApolloClient({
  link: ApolloLink.from([recoveryLink, enrichLink, httpLink]),
  cache: new InMemoryCache(),
});
