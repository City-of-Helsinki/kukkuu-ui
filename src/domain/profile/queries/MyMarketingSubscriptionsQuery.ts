import { gql } from '@apollo/client';

const myMarketingSubscriptionsQuery = gql`
  query MyMarketingSubscriptions($authToken: String) {
    myMarketingSubscriptions(authToken: $authToken) {
      firstName
      lastName
      language
      hasAcceptedMarketing
    }
  }
`;
export default myMarketingSubscriptionsQuery;
