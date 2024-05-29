import { gql } from '@apollo/client';

const myCommunicationSubscriptionsQuery = gql`
  query MyCommunicationSubscriptions($authToken: String) {
    myCommunicationSubscriptions(authToken: $authToken) {
      firstName
      lastName
      language
      hasAcceptedCommunication
    }
  }
`;
export default myCommunicationSubscriptionsQuery;
