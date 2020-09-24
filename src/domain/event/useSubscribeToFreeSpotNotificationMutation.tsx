import subscribeToFreeSpotNotificationMutation from './mutations/subscribeToFreeSpotNotificationMutation';
// eslint-disable-next-line max-len
import { subscribeToFreeSpotNotificationMutation as SubscribeToFreeSpotNotificationMutation } from '../api/generatedTypes/subscribeToFreeSpotNotificationMutation';
import useMutation from '../api/useMutation';

function useSubscribeToFreeSpotNotificationMutation() {
  return useMutation<SubscribeToFreeSpotNotificationMutation>(
    subscribeToFreeSpotNotificationMutation,
    {
      useDefaultErrorHandling: true,
    }
  );
}

export default useSubscribeToFreeSpotNotificationMutation;
