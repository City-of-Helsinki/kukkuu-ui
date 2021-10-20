import { gql } from '@apollo/client';

const subscribeToFreeSpotNotificationMutation = gql`
  mutation subscribeToFreeSpotNotificationMutation(
    $input: SubscribeToFreeSpotNotificationMutationInput!
  ) {
    subscribeToFreeSpotNotification(input: $input) {
      clientMutationId
    }
  }
`;

export default subscribeToFreeSpotNotificationMutation;
