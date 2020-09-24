import React from 'react';
import { useTranslation, Trans } from 'react-i18next';

import { formatTime, newMoment } from '../../common/time/utils';
import {
  DEFAULT_DATE_FORMAT,
  DEFAULT_TIME_FORMAT,
} from '../../common/time/TimeConstants';
import { occurrenceQuery_occurrence as Occurrence } from '../api/generatedTypes/occurrenceQuery';
import ConfirmModal from '../../common/components/confirm/ConfirmModal';
import useSubscribeToFreeSpotNotificationMutation from './useSubscribeToFreeSpotNotificationMutation';

type Props = {
  childId: string;
  eventOccurrence: Occurrence;
  isOpen: boolean;
  onSubscribed?: () => void;
  setIsOpen: (isOpen: boolean) => void;
};

const EventNotificationSubscriptionModal = ({
  childId,
  eventOccurrence,
  isOpen,
  onSubscribed,
  setIsOpen,
}: Props) => {
  const { t } = useTranslation();
  const [subscribe] = useSubscribeToFreeSpotNotificationMutation();

  const handleAnswer = async (consented: boolean) => {
    if (consented) {
      const { errors } = await subscribe({
        variables: {
          input: {
            occurrenceId: eventOccurrence.id,
            childId,
          },
        },
      });

      if (!errors && onSubscribed) {
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
