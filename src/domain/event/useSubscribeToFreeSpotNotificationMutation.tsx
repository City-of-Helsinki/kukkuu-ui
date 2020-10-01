import subscribeToFreeSpotNotificationMutation from './mutations/subscribeToFreeSpotNotificationMutation';
// eslint-disable-next-line max-len
import { subscribeToFreeSpotNotificationMutation as SubscribeToFreeSpotNotificationMutation } from '../api/generatedTypes/subscribeToFreeSpotNotificationMutation';
import useMutation from '../api/useMutation';
import eventQuery from './queries/eventQuery';

function useSubscribeToFreeSpotNotificationMutation(
  eventId: string,
  childId: string
) {
  return useMutation<SubscribeToFreeSpotNotificationMutation>(
    subscribeToFreeSpotNotificationMutation,
    {
      useDefaultErrorHandling: true,
      refetchQueries: [
        {
          query: eventQuery,
          variables: {
            id: eventId,
            childId,
          },
        },
      ],
    }
  );
}

export default useSubscribeToFreeSpotNotificationMutation;
