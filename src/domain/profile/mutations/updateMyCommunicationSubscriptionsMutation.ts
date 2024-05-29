import { gql } from '@apollo/client';

const updateMyCommunicationSubscriptionsMutation = gql`
  mutation UpdateMyCommunicationSubscriptions(
    $input: UpdateMyCommunicationSubscriptionsMutationInput!
  ) {
    updateMyCommunicationSubscriptions(input: $input) {
      guardian {
        firstName
        lastName
        language
        hasAcceptedCommunication
      }
    }
  }
`;

export default updateMyCommunicationSubscriptionsMutation;
