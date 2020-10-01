import UnsubscribeFromFreeSpotNotificationMutation from './mutations/unsubscribeFromFreeSpotNotificationMutation';
// eslint-disable-next-line max-len
import { unsubscribeFromFreeSpotNotificationMutation } from '../api/generatedTypes/unsubscribeFromFreeSpotNotificationMutation';
import useMutation from '../api/useMutation';
import eventQuery from './queries/eventQuery';

function useUnsubscribeFromFreeSpotNotificationMutation(
  eventId: string,
  childId: string
) {
  return useMutation<unsubscribeFromFreeSpotNotificationMutation>(
    UnsubscribeFromFreeSpotNotificationMutation,
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

export default useUnsubscribeFromFreeSpotNotificationMutation;
