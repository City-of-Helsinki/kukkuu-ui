import gql from 'graphql-tag';

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
