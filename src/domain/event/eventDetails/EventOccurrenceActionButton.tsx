import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import Button from '../../../common/components/button/Button';
import LinkButton from '../../../common/components/button/LinkButton';
import useGetPathname from '../../../common/route/utils/useGetPathname';
import { TicketSystem } from '../../api/generatedTypes/graphql';
import { externalTicketSystems } from '../constants/ExternalTicketSystemConstants';
import { isOccurrenceFull } from '../EventUtils';
import type {
  EventOccurrencesTableEvent,
  EventOccurrencesTableOccurrence,
} from './EventOccurrencesTable';
import styles from './eventOccurrencesTable.module.scss';

export type ShowEnrolmentButtonProps = {
  onShow?: () => void;
  className?: string;
};

export const ShowEnrolmentButton: React.FC<ShowEnrolmentButtonProps> = ({
  onShow,
  className,
}) => {
  const { t } = useTranslation();
  return (
    <Button
      variant="secondary"
      onClick={onShow}
      className={classNames(styles.actionButton, className)}
    >
      {t('event.occurrencesTable.showEnrolmentButton')}
    </Button>
  );
};

export type CancelEnrolmentButtonProps = {
  onCancel?: () => void;
  className?: string;
};

export const CancelEnrolmentButton: React.FC<CancelEnrolmentButtonProps> = ({
  onCancel,
  className,
}) => <ShowEnrolmentButton onShow={onCancel} className={className} />;

export type AlreadyEnrolledOtherButtonProps = {
  className?: string;
};

export const AlreadyEnrolledOtherButton: React.FC<
  AlreadyEnrolledOtherButtonProps
> = ({ className }) => {
  const { t } = useTranslation();
  const label = t('event.occurrencesTable.alreadyEnrolledOther');
  return (
    <Button
      variant="disabled"
      disabled
      aria-disabled="true"
      className={classNames(styles.actionButton, styles.disabledButton, className)}
      aria-label={label}
      title={label}
    >
      {t('event.occurrencesTable.enrolButton')}
    </Button>
  );
};

export type CannotEnrolButtonProps = {
  className?: string;
};

export const CannotEnrolButton: React.FC<CannotEnrolButtonProps> = ({
  className,
}) => {
  const { t } = useTranslation();
  return (
    <Button
      variant="disabled"
      disabled
      aria-disabled="true"
      className={classNames(styles.actionButton, styles.disabledButton, className)}
    >
      {t('event.occurrencesTable.enrolButton')}
    </Button>
  );
};

export type ExternalTicketLinkButtonProps = {
  to: string;
  className?: string;
};

export const ExternalTicketLinkButton: React.FC<
  ExternalTicketLinkButtonProps
> = ({ to, className }) => {
  const { t } = useTranslation();
  return (
    <LinkButton
      to={to}
      className={classNames(styles.actionButton, styles.enrolButton, className)}
    >
      {t('event.occurrencesTable.enrolButton')}
    </LinkButton>
  );
};

export type EnrolButtonProps = {
  onEnrol: () => void;
  className?: string;
};

export const EnrolButton: React.FC<EnrolButtonProps> = ({
  onEnrol,
  className,
}) => {
  const { t } = useTranslation();
  return (
    <Button
      variant="primary"
      onClick={onEnrol}
      className={classNames(styles.actionButton, styles.enrolButton, className)}
    >
      {t('event.occurrencesTable.enrolButton')}
    </Button>
  );
};

export type UnsubscribeNotificationButtonProps = {
  onUnsubscribe: () => void;
  className?: string;
};

export const UnsubscribeNotificationButton: React.FC<
  UnsubscribeNotificationButtonProps
> = ({ onUnsubscribe, className }) => {
  const { t } = useTranslation();
  return (
    <Button
      variant="secondary"
      onClick={onUnsubscribe}
      className={classNames(styles.actionButton, styles.unsubscribeButton, className)}
    >
      {t('event.occurrencesTable.cancelNotificationSubscription')}
    </Button>
  );
};

export type SubscribeNotificationButtonProps = {
  onSubscribe: () => void;
  className?: string;
};

export const SubscribeNotificationButton: React.FC<
  SubscribeNotificationButtonProps
> = ({ onSubscribe, className }) => {
  const { t } = useTranslation();
  return (
    <Button
      variant="secondary"
      onClick={onSubscribe}
      className={classNames(styles.actionButton, styles.subscribeButton, className)}
    >
      {t('event.occurrencesTable.subscribeNotificationButton')}
    </Button>
  );
};

/**
 * Props for {@link EventOccurrenceActionButton}.
 */
export type EventOccurrenceActionButtonProps = {
  occurrence: EventOccurrencesTableOccurrence;
  event: EventOccurrencesTableEvent;
  childId: string;
  enrolledOccurrenceId?: string | null;
  onEnrol: (occurrence: EventOccurrencesTableOccurrence) => void;
  onCancelEnrolment?: (occurrence: EventOccurrencesTableOccurrence) => void;
  onShowEnrolment?: (occurrence: EventOccurrencesTableOccurrence) => void;
  onSubscribe: (occurrence: EventOccurrencesTableOccurrence) => void;
  onUnsubscribe: (occurrence: EventOccurrencesTableOccurrence) => void;
  className?: string;
};

export type EventOccurrenceActionButtonComponent = React.FC<
  EventOccurrenceActionButtonProps
> & {
  Cancel: typeof CancelEnrolmentButton;
  ShowEnrolment: typeof ShowEnrolmentButton;
  AlreadyEnrolledOther: typeof AlreadyEnrolledOtherButton;
  CannotEnrol: typeof CannotEnrolButton;
  External: typeof ExternalTicketLinkButton;
  Enrol: typeof EnrolButton;
  Unsubscribe: typeof UnsubscribeNotificationButton;
  Subscribe: typeof SubscribeNotificationButton;
};

/**
 * Renders the primary registration, cancellation, subscription, or external ticket action button
 * for an occurrence based on capacity and enrollment state.
 */
export const EventOccurrenceActionButton: EventOccurrenceActionButtonComponent = ({
  occurrence,
  event,
  childId,
  enrolledOccurrenceId,
  onEnrol,
  onCancelEnrolment,
  onShowEnrolment,
  onSubscribe,
  onUnsubscribe,
  className,
}) => {
  const getPathname = useGetPathname();

  const isFull = isOccurrenceFull(occurrence.remainingCapacity);
  const hasSpots = !isFull;
  const ticketSystemType =
    event.ticketSystem?.type ?? occurrence.ticketSystem?.type;
  const isExternal = externalTicketSystems.includes(
    ticketSystemType as TicketSystem
  );
  const isSubscribed = Boolean(
    occurrence.childHasFreeSpotNotificationSubscription
  );
  const isEnrolledInThisOcc = enrolledOccurrenceId === occurrence.id;
  const isEnrolledInOtherOcc = Boolean(
    enrolledOccurrenceId && enrolledOccurrenceId !== occurrence.id
  );
  const canEnroll = event.enrolmentDeniedReason === null;
  const redirectUrl = getPathname(
    `/profile/child/${childId}/event/${event.id}/redirect`
  );

  if (isEnrolledInThisOcc) {
    const handleShowEnrolment = onShowEnrolment ?? onCancelEnrolment;
    return (
      <ShowEnrolmentButton
        onShow={() => handleShowEnrolment?.(occurrence)}
        className={className}
      />
    );
  }

  if (isEnrolledInOtherOcc) {
    return <AlreadyEnrolledOtherButton className={className} />;
  }

  if (!canEnroll) {
    return <CannotEnrolButton className={className} />;
  }

  if (isExternal) {
    return <ExternalTicketLinkButton to={redirectUrl} className={className} />;
  }

  if (hasSpots) {
    return (
      <EnrolButton
        onEnrol={() => onEnrol(occurrence)}
        className={className}
      />
    );
  }

  if (isSubscribed) {
    return (
      <UnsubscribeNotificationButton
        onUnsubscribe={() => onUnsubscribe(occurrence)}
        className={className}
      />
    );
  }

  return (
    <SubscribeNotificationButton
      onSubscribe={() => onSubscribe(occurrence)}
      className={className}
    />
  );
};

EventOccurrenceActionButton.Cancel = CancelEnrolmentButton;
EventOccurrenceActionButton.ShowEnrolment = ShowEnrolmentButton;
EventOccurrenceActionButton.AlreadyEnrolledOther = AlreadyEnrolledOtherButton;
EventOccurrenceActionButton.CannotEnrol = CannotEnrolButton;
EventOccurrenceActionButton.External = ExternalTicketLinkButton;
EventOccurrenceActionButton.Enrol = EnrolButton;
EventOccurrenceActionButton.Unsubscribe = UnsubscribeNotificationButton;
EventOccurrenceActionButton.Subscribe = SubscribeNotificationButton;

export default EventOccurrenceActionButton;
