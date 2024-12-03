import { useTranslation, Trans } from 'react-i18next';

import { formatTime, newMoment } from '../../common/time/utils';
import {
  DEFAULT_DATE_FORMAT,
  DEFAULT_TIME_FORMAT,
} from '../../common/time/TimeConstants';
import ConfirmModal from '../../common/components/confirm/ConfirmModal';
import useSubscribeToFreeSpotNotificationMutation from './useSubscribeToFreeSpotNotificationMutation';

export type Occurrence = {
  id: string | null;
  time: string | null;
  event: {
    name: string | null;
  };
};

type Props = {
  childId: string;
  eventId: string;
  eventOccurrence: Occurrence;
  isOpen: boolean;
  onSubscribed?: () => void;
  setIsOpen: (isOpen: boolean) => void;
};

const EventNotificationSubscriptionModal = ({
  childId,
  eventId,
  eventOccurrence,
  isOpen,
  onSubscribed,
  setIsOpen,
}: Props) => {
  const { t } = useTranslation();
  const [subscribe] = useSubscribeToFreeSpotNotificationMutation(
    eventId,
    childId
  );

  const handleAnswer = async (consented: boolean) => {
    if (consented) {
      // No try-catch block here because default error handling is enabled in
      // useSubscribeToFreeSpotNotificationMutation
      await subscribe({
        variables: {
          input: {
            occurrenceId: eventOccurrence.id,
            childId,
          },
        },
      });

      if (onSubscribed) {
        onSubscribed();
      }
    }
  };

  const occurrenceTime = newMoment(eventOccurrence.time);

  return (
    <ConfirmModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      answer={handleAnswer}
      heading={t('enrollment.notificationSubscriptionModal.title')}
      cancel={t('enrollment.notificationSubscriptionModal.cancel')}
      ok={t('enrollment.notificationSubscriptionModal.subscribe')}
    >
      <Trans
        i18nKey="enrollment.notificationSubscriptionModal.description"
        values={{
          eventName: eventOccurrence.event.name,
          date: formatTime(occurrenceTime, DEFAULT_DATE_FORMAT),
          time: formatTime(occurrenceTime, DEFAULT_TIME_FORMAT),
        }}
        components={{
          b: <strong />,
        }}
      />
    </ConfirmModal>
  );
};

export default EventNotificationSubscriptionModal;
