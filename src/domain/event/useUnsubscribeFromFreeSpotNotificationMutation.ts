import UnsubscribeFromFreeSpotNotificationMutation from './mutations/unsubscribeFromFreeSpotNotificationMutation';
// eslint-disable-next-line max-len
import { unsubscribeFromFreeSpotNotificationMutation } from '../api/generatedTypes/unsubscribeFromFreeSpotNotificationMutation';
import useMutation from '../api/useMutation';

function useUnsubscribeFromFreeSpotNotificationMutation() {
  return useMutation<unsubscribeFromFreeSpotNotificationMutation>(
    UnsubscribeFromFreeSpotNotificationMutation,
    {
      useDefaultErrorHandling: true,
    }
  );
}

export default useUnsubscribeFromFreeSpotNotificationMutation;
