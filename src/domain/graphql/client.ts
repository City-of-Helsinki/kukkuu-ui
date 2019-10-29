import ApolloClient from 'apollo-boost';

import getAuthenticatedUser from '../auth/getAuthenticatedUser';

export default new ApolloClient({
  request: async operation => {
    try {
      const user = await getAuthenticatedUser();
      operation.setContext({
        headers: {
          Authorization: `Bearer ${user.id_token}`,
        },
      });
    } catch (e) {
      // User not authenticated
      console.error(e);
    }
  },
  uri: process.env.REACT_APP_PROFILE_GRAPHQL,
});
