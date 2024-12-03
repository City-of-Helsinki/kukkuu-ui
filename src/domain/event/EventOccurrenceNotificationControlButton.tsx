import { useState } from 'react';

import Button from '../../common/components/button/Button';
import EventNotificationSubscriptionModal, {
  Occurrence,
} from './EventNotificationSubscriptionModal';
import useUnsubscribeFromFreeSpotNotificationMutation from './useUnsubscribeFromFreeSpotNotificationMutation';
import styles from './eventOccurrenceNotificationControlButton.module.css';

type Props = {
  childId: string;
  eventId: string;
  isSubscribed: boolean;
  occurrence: Occurrence;
  onUnsubscribed?: () => void;
  onSubscribe?: () => void;
  onSubscribed?: () => void;
  subscribeLabel: string;
  unsubscribeLabel: string;
};

const EventNotificationControlButton = ({
  childId,
  eventId,
  isSubscribed,
  occurrence,
  onUnsubscribed,
  onSubscribe,
  onSubscribed,
  subscribeLabel,
  unsubscribeLabel,
}: Props) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [unsubscribe] = useUnsubscribeFromFreeSpotNotificationMutation(
    eventId,
    childId
  );

  const handleSubscribe = () => {
    if (onSubscribe) {
      onSubscribe();
    }

    setIsModalOpen(true);
  };

  const handleSubscribed = () => {
    if (onSubscribed) {
      onSubscribed();
    }

    setIsModalOpen(false);
  };

  const handleUnsubscribe = async () => {
    // No try-catch block here because default error handling is enabled in
    // useUnsubscribeFromFreeSpotNotificationMutation
    await unsubscribe({
      variables: {
        input: {
          childId,
          occurrenceId: occurrence.id,
        },
      },
    });

    if (onUnsubscribed) {
      onUnsubscribed();
    }
  };

  return (
    <>
      {!isSubscribed && (
        <Button
          variant="disabled"
          onClick={handleSubscribe}
          className={styles.button}
        >
          {subscribeLabel}
        </Button>
      )}
      {isSubscribed && (
        <Button
          onClick={handleUnsubscribe}
          variant="secondary"
          className={styles.button}
        >
          {unsubscribeLabel}
        </Button>
      )}
      <EventNotificationSubscriptionModal
        childId={childId}
        eventId={eventId}
        eventOccurrence={occurrence}
        isOpen={isModalOpen}
        onSubscribed={handleSubscribed}
        setIsOpen={setIsModalOpen}
      />
    </>
  );
};

export default EventNotificationControlButton;
