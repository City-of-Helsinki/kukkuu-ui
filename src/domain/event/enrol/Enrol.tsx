import React from 'react';
import { useTranslation } from 'react-i18next';
import joinClassNames from 'classnames';

import styles from './enrol.module.scss';
import { occurrenceQuery_occurrence as OccurrenceType } from '../../api/generatedTypes/occurrenceQuery';
import OccurrenceInfo from '../partial/OccurrenceInfo';
import Button from '../../../common/components/button/Button';
import EventOccurrenceNotificationControlButton from '../EventOccurrenceNotificationControlButton';

type Props = {
  childId: string;
  occurrence: OccurrenceType;
  onCancel: () => void;
  onEnrol: () => void;
  onUnsubscribed?: () => void;
  onSubscribe?: () => void;
  onSubscribed?: () => void;
};

const Enrol = ({
  childId,
  occurrence,
  onCancel,
  onEnrol,
  onUnsubscribed,
  onSubscribe,
  onSubscribed,
}: Props) => {
  const { t } = useTranslation();

  const isFull = occurrence.remainingCapacity === 0;
  const isChildHasActiveSubscription = Boolean(
    occurrence.childHasFreeSpotNotificationSubscription
  );
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
          {isFull && (
            <EventOccurrenceNotificationControlButton
              childId={childId}
              eventId={occurrence.event.id}
              isSubscribed={isChildHasActiveSubscription}
              occurrence={occurrence}
              onUnsubscribed={onUnsubscribed}
              onSubscribe={onSubscribe}
              onSubscribed={onSubscribed}
              unsubscribeLabel={t(
                'enrollment.button.cancelNotificationSubscription'
              )}
              subscribeLabel={t(
                'enrollment.button.occurrenceFullSubscribeToNotifications'
              )}
            />
          )}
          <Button onClick={onCancel} variant="secondary">
            {t('enrollment.confirmationPage.cancel.button')}
          </Button>
        </div>
      </div>
    </>
  );
};

export default Enrol;
