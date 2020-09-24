import gql from 'graphql-tag';

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
