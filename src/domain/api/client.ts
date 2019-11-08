import ApolloClient from 'apollo-boost';

import getAuthenticatedUser from '../auth/getAuthenticatedUser';

export default new ApolloClient({
  request: async operation => {
    try {
      const user = await getAuthenticatedUser();
      operation.setContext({
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });
    } catch (e) {
      // User not authenticated
      // eslint-disable-next-line no-console
      console.error(e);
      // TODO: add error-handler
    }
  },
  uri: process.env.REACT_APP_API_URI,
});
