import React from 'react';
import { useTranslation } from 'react-i18next';
import joinClassNames from 'classnames';

import styles from './enrol.module.scss';
import { occurrenceQuery_occurrence as OccurrenceType } from '../../api/generatedTypes/occurrenceQuery';
import OccurrenceInfo from '../partial/OccurrenceInfo';
import Button from '../../../common/components/button/Button';
import EventNotificationSubscriptionModal from '../EventNotificationSubscriptionModal';

type Props = {
  childId: string;
  isSubscriptionModalOpen: boolean;
  occurrence: OccurrenceType;
  onCancel: () => void;
  onEnrol: () => void;
  onUnsubscribe: () => void;
  onSubscribe: () => void;
  onSubscribed: () => void;
  setIsSubscriptionModalOpen: (isOpen: boolean) => void;
};

const Enrol = ({
  childId,
  isSubscriptionModalOpen,
  occurrence,
  onCancel,
  onEnrol,
  onUnsubscribe,
  onSubscribe,
  onSubscribed,
  setIsSubscriptionModalOpen,
}: Props) => {
  const { t } = useTranslation();

  const isFull = occurrence.remainingCapacity === 0;
  const isChildHasActiveSubscription =
    occurrence.childHasFreeSpotNotificationSubscription;
  const eventName = occurrence.event.name;

  return (
    <>
      <div className={styles.enrolWrapper} role="main">
        <div className={styles.heading}>
          <h1>
            {!isFull &&
              `${t('enrollment.confirmationPage.heading.text')} ${eventName}`}
            {isFull &&
              t('enrollment.confirmationPage.heading.full', { eventName })}
          </h1>
        </div>
        <div className={styles.text}>
          {!isFull && t('enrollment.confirmationPage.description.text')}
          {isFull && t('enrollment.confirmationPage.description.full')}
        </div>
        <OccurrenceInfo
          occurrence={occurrence}
          className={joinClassNames(styles.occurrenceInfo, styles.wrap)}
        />
        <div className={styles.actions}>
          {!isFull && (
            <Button onClick={onEnrol}>
              {t('enrollment.confirmationPage.confirm.button')}
            </Button>
          )}
          {isFull && !isChildHasActiveSubscription && (
            <Button variant="disabled" onClick={onSubscribe}>
              {t('enrollment.button.occurrenceFullSubscribeToNotifications')}
            </Button>
          )}
          {isFull && isChildHasActiveSubscription && (
            <Button onClick={onUnsubscribe} variant="secondary">
              {t('enrollment.button.cancelNotificationSubscription')}
            </Button>
          )}
          <Button onClick={onCancel} variant="secondary">
            {t('enrollment.confirmationPage.cancel.button')}
          </Button>
        </div>
      </div>
      <EventNotificationSubscriptionModal
        childId={childId}
        eventOccurrence={occurrence}
        isOpen={isSubscriptionModalOpen}
        onSubscribed={onSubscribed}
        setIsOpen={setIsSubscriptionModalOpen}
      />
    </>
  );
};

export default Enrol;
