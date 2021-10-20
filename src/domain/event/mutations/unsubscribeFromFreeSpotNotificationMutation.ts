import { gql } from '@apollo/client';

const unsubscribeFromFreeSpotNotificationMutation = gql`
  mutation unsubscribeFromFreeSpotNotificationMutation(
    $input: UnsubscribeFromFreeSpotNotificationMutationInput!
  ) {
    unsubscribeFromFreeSpotNotification(input: $input) {
      clientMutationId
    }
  }
`;

export default unsubscribeFromFreeSpotNotificationMutation;
