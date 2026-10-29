import React from 'react';
import { useTranslation } from 'react-i18next';

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

export type ShowEnrolmentButtonProps = {
  onShow?: () => void;
  fullWidth?: boolean;
  className?: string;
};

export const ShowEnrolmentButton: React.FC<ShowEnrolmentButtonProps> = ({
  onShow,
  fullWidth,
  className,
}) => {
  const { t } = useTranslation();
  return (
    <Button
      variant="secondary"
      theme="black"
      fullWidth={fullWidth}
      onClick={onShow}
      className={className}
    >
      {t('event.occurrencesTable.showEnrolmentButton')}
    </Button>
  );
};

export type CancelEnrolmentButtonProps = {
  onCancel?: () => void;
  fullWidth?: boolean;
  className?: string;
};

export const CancelEnrolmentButton: React.FC<CancelEnrolmentButtonProps> = ({
  onCancel,
  fullWidth,
  className,
}) => (
  <ShowEnrolmentButton
    onShow={onCancel}
    fullWidth={fullWidth}
    className={className}
  />
);

export type AlreadyEnrolledOtherButtonProps = {
  fullWidth?: boolean;
  className?: string;
};

export const AlreadyEnrolledOtherButton: React.FC<
  AlreadyEnrolledOtherButtonProps
> = ({ fullWidth, className }) => {
  const { t } = useTranslation();
  const label = t('event.occurrencesTable.alreadyEnrolledOther');
  return (
    <Button
      variant="primary"
      theme="black"
      disabled
      aria-disabled="true"
      fullWidth={fullWidth}
      className={className}
      aria-label={label}
      title={label}
    >
      {t('event.occurrencesTable.enrolButton')}
    </Button>
  );
};

export type CannotEnrolButtonProps = {
  fullWidth?: boolean;
  className?: string;
};

export const CannotEnrolButton: React.FC<CannotEnrolButtonProps> = ({
  fullWidth,
  className,
}) => {
  const { t } = useTranslation();
  return (
    <Button
      variant="primary"
      theme="black"
      disabled
      aria-disabled="true"
      fullWidth={fullWidth}
      className={className}
    >
      {t('event.occurrencesTable.enrolButton')}
    </Button>
  );
};

export type ExternalTicketLinkButtonProps = {
  to: string;
  fullWidth?: boolean;
  className?: string;
};

export const ExternalTicketLinkButton: React.FC<
  ExternalTicketLinkButtonProps
> = ({ to, fullWidth, className }) => {
  const { t } = useTranslation();
  return (
    <LinkButton
      to={to}
      variant="primary"
      theme="black"
      fullWidth={fullWidth}
      className={className}
    >
      {t('event.occurrencesTable.enrolButton')}
    </LinkButton>
  );
};

export type EnrolButtonProps = {
  onEnrol: () => void;
  fullWidth?: boolean;
  className?: string;
};

export const EnrolButton: React.FC<EnrolButtonProps> = ({
  onEnrol,
  fullWidth,
  className,
}) => {
  const { t } = useTranslation();
  return (
    <Button
      variant="primary"
      theme="black"
      fullWidth={fullWidth}
      onClick={onEnrol}
      className={className}
    >
      {t('event.occurrencesTable.enrolButton')}
    </Button>
  );
};

export type UnsubscribeNotificationButtonProps = {
  onUnsubscribe: () => void;
  fullWidth?: boolean;
  className?: string;
};

export const UnsubscribeNotificationButton: React.FC<
  UnsubscribeNotificationButtonProps
> = ({ onUnsubscribe, fullWidth, className }) => {
  const { t } = useTranslation();
  return (
    <Button
      variant="secondary"
      theme="black"
      fullWidth={fullWidth}
      onClick={onUnsubscribe}
      className={className}
    >
      {t('event.occurrencesTable.cancelNotificationSubscription')}
    </Button>
  );
};

export type SubscribeNotificationButtonProps = {
  onSubscribe: () => void;
  fullWidth?: boolean;
  className?: string;
};

export const SubscribeNotificationButton: React.FC<
  SubscribeNotificationButtonProps
> = ({ onSubscribe, fullWidth, className }) => {
  const { t } = useTranslation();
  return (
    <Button
      variant="secondary"
      theme="black"
      fullWidth={fullWidth}
      onClick={onSubscribe}
      className={className}
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
  fullWidth?: boolean;
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
  fullWidth,
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
        fullWidth={fullWidth}
        className={className}
      />
    );
  }

  if (isEnrolledInOtherOcc) {
    return (
      <AlreadyEnrolledOtherButton fullWidth={fullWidth} className={className} />
    );
  }

  if (!canEnroll) {
    return <CannotEnrolButton fullWidth={fullWidth} className={className} />;
  }

  if (isExternal) {
    return (
      <ExternalTicketLinkButton
        to={redirectUrl}
        fullWidth={fullWidth}
        className={className}
      />
    );
  }

  if (hasSpots) {
    return (
      <EnrolButton
        onEnrol={() => onEnrol(occurrence)}
        fullWidth={fullWidth}
        className={className}
      />
    );
  }

  if (isSubscribed) {
    return (
      <UnsubscribeNotificationButton
        onUnsubscribe={() => onUnsubscribe(occurrence)}
        fullWidth={fullWidth}
        className={className}
      />
    );
  }

  return (
    <SubscribeNotificationButton
      onSubscribe={() => onSubscribe(occurrence)}
      fullWidth={fullWidth}
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
