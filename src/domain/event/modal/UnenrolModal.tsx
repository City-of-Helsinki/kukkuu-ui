import React, { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import { Link } from 'react-router';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import {
  Button,
  ButtonVariant,
  Dialog,
  IconCalendar,
  IconCheck,
  IconClock,
  IconFaceSmile,
  IconLocation,
  IconTrash,
  IconUser,
  StatusLabel,
} from 'hds-react';

import useGetPathname from '../../../common/route/utils/useGetPathname';
import unenrolOccurrenceMutation from '../mutations/unenrolOccurrenceMutation';
import {
  UnenrolOccurrenceMutation,
  UnenrolOccurrenceMutationVariables,
  OccurrenceQuery,
} from '../../api/generatedTypes/graphql';
import occurrenceQuery from '../queries/occurrenceQuery';
import getEventOrEventGroupOccurrenceRefetchQueries from '../getEventOrEventGroupOccurrenceRefetchQueries';
import AppConfig from '../../app/AppConfig';
import graphqlClient from '../../api/client';
import { useProfileContext } from '../../profile/hooks/useProfileContext';
import { handleUnenrolCompleted } from './handleUnenrolCompleted';
import { shouldAllowUnenrolment } from '../EventUtils';
import {
  formatOccurrenceDateLong,
  formatOccurrenceTimeRange,
} from '../../../common/time/occurrenceTime';
import styles from './unenrolModal.module.scss';

export interface UnenrolModalOccurrence {
  id: string;
  time: string;
  venue?: {
    id?: string;
    name?: string | null;
    address?: string | null;
  } | null;
  event?: {
    id: string;
    name?: string | null;
    duration?: number | null;
    eventGroup?: { id: string } | null;
  } | null;
}

export interface UnenrolModalEvent {
  id: string;
  name?: string | null;
  duration?: number | null;
  eventGroup?: { id: string } | null;
}

export interface UnenrolModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  childId: string;
  occurrenceId: string;
  eventId?: string;
  eventGroupId?: string;
  occurrence?: UnenrolModalOccurrence | null;
  event?: UnenrolModalEvent | null;
  childName?: string;
  onSuccess?: () => void;
}

const UnenrolModal: React.FC<UnenrolModalProps> = ({
  isOpen,
  setIsOpen,
  childId,
  occurrenceId,
  eventId,
  eventGroupId,
  occurrence,
  event,
  childName: propChildName,
  onSuccess,
}) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const getPathname = useGetPathname();
  const { profile, refetchProfile } = useProfileContext();
  const titleId = useId();
  const descriptionId = useId();

  // If occurrence data was not passed in, query it
  const { data: queryData } = useQuery<OccurrenceQuery>(occurrenceQuery, {
    client: graphqlClient,
    variables: { id: occurrenceId, childId },
    skip: !isOpen || Boolean(occurrence),
  });

  const resolvedOccurrence = occurrence || queryData?.occurrence || null;
  const occurrenceTime = resolvedOccurrence?.time;
  const resolvedEventId =
    resolvedOccurrence?.event?.id || event?.id || eventId || '';
  const resolvedEventGroupId =
    resolvedOccurrence?.event?.eventGroup?.id ||
    event?.eventGroup?.id ||
    eventGroupId;
  const eventName =
    resolvedOccurrence?.event?.name || event?.name || '';
  const eventDuration =
    resolvedOccurrence?.event?.duration || event?.duration || null;

  const venue = resolvedOccurrence?.venue;
  const venueText = venue
    ? [venue.name, venue.address].filter(Boolean).join(', ')
    : '';

  const formattedDate = occurrenceTime
    ? formatOccurrenceDateLong(occurrenceTime, i18n.language)
    : '';
  const formattedTime = occurrenceTime
    ? formatOccurrenceTimeRange(occurrenceTime, eventDuration)
    : '';

  const matchedChild = (profile?.children?.edges || [])
    .map((e) => e?.node)
    .find((c) => c?.id === childId);
  const childName = propChildName || matchedChild?.name || '';
  const guardianName = [profile?.firstName, profile?.lastName]
    .filter(Boolean)
    .join(' ');

  const canUnenrol = occurrenceTime
    ? shouldAllowUnenrolment(occurrenceTime)
    : true;

  const occurrenceDetailsUrl = resolvedEventId
    ? getPathname(`/profile/child/${childId}/event/${resolvedEventId}`)
    : getPathname(`/profile/child/${childId}/events`);

  const [unenrolOccurrence, { loading: isUnenrolling }] = useMutation<
    UnenrolOccurrenceMutation,
    UnenrolOccurrenceMutationVariables
  >(unenrolOccurrenceMutation, {
    client: graphqlClient,
    refetchQueries: getEventOrEventGroupOccurrenceRefetchQueries({
      childId,
      eventGroupId: resolvedEventGroupId,
    }),
    awaitRefetchQueries: true,
    onCompleted: async (data) => {
      await handleUnenrolCompleted(data, {
        dispatch,
        refetchProfile,
        navigateToProfile: () => {
          setIsOpen(false);
          toast.success(
            t(
              'enrollment.cancellation.successMessage',
              'Ilmoittautuminen peruttu onnistuneesti.'
            )
          );
          if (onSuccess) {
            onSuccess();
          }
        },
      });
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.error(error);
      toast.error(t('registration.submitMutation.errorMessage'));
    },
  });

  const handleConfirm = async () => {
    try {
      await unenrolOccurrence({
        variables: {
          input: {
            occurrenceId,
            childId,
          },
        },
      });
    } catch {
      // Error handled in onError
    }
  };

  return (
    <Dialog
      id="unenrol-occurrence-dialog"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      isOpen={isOpen}
      close={() => setIsOpen(false)}
      closeButtonLabelText={t('common.closeButton.altText')}
      variant="primary"
      className={styles.modal}
    >
      <Dialog.Header
        id={titleId}
        title={t('event.cancellation.modal.title', 'Peruuta ilmoittautuminen')}
      />
      <Dialog.Content>
        <div id={descriptionId}>
          <p className={styles.promptText}>
            {t(
              'event.cancellation.modal.prompt',
              'Oletko varma, että haluat peruuttaa ilmoittautumisesi tapahtumaan?'
            )}
          </p>

          <div className={styles.enrolmentCard}>
            <h3 className={styles.eventTitle}>
              {resolvedEventId ? (
                <Link
                  to={occurrenceDetailsUrl}
                  className={styles.eventTitleLink}
                  onClick={() => setIsOpen(false)}
                >
                  {eventName}
                </Link>
              ) : (
                eventName
              )}
            </h3>

            {childName && (
              <div className={styles.badgeRow}>
                <StatusLabel
                  type="alert"
                  iconStart={<IconCheck aria-hidden="true" />}
                  className={styles.enrolledBadge}
                >
                  {t('event.cancellation.modal.enrolledBadge', {
                    name: childName,
                    defaultValue: `Ilmoittautunut: ${childName}`,
                  })}
                </StatusLabel>
              </div>
            )}

            <div className={styles.metaList}>
              {(formattedDate || formattedTime) && (
                <div className={styles.metaRow}>
                  {formattedDate && (
                    <>
                      <IconCalendar aria-hidden="true" className={styles.icon} />
                      <span>{formattedDate}</span>
                    </>
                  )}
                  {formattedTime && (
                    <span className={styles.timeGroup}>
                      <IconClock aria-hidden="true" className={styles.icon} />
                      <span>{t('common.dateTimeSeparator', 'klo')} {formattedTime}</span>
                    </span>
                  )}
                </div>
              )}

              {venueText && (
                <div className={styles.metaRow}>
                  <IconLocation aria-hidden="true" className={styles.icon} />
                  <span>{venueText}</span>
                </div>
              )}

              {childName && (
                <div className={styles.metaRow}>
                  <IconFaceSmile aria-hidden="true" className={styles.icon} />
                  <span>{childName}</span>
                </div>
              )}

              {guardianName && (
                <div className={styles.metaRow}>
                  <IconUser aria-hidden="true" className={styles.icon} />
                  <span>{guardianName}</span>
                </div>
              )}
            </div>

            {resolvedEventId && (
              <div className={styles.detailsLinkWrapper}>
                <Link
                  to={occurrenceDetailsUrl}
                  className={styles.detailsLink}
                  onClick={() => setIsOpen(false)}
                >
                  {t(
                    'event.cancellation.modal.viewDetailsLink',
                    'Katso tapahtuma-ajan tiedot'
                  )}
                </Link>
              </div>
            )}
          </div>

          {!canUnenrol && (
            <p className={styles.deadlineNotice}>
              {t('enrollment.cancellation.disabledDescription', {
                unerolHoursBeforeOccurrence:
                  AppConfig.enrolmentCancellationTimeLimitHours,
              })}
            </p>
          )}
        </div>
      </Dialog.Content>
      <Dialog.ActionButtons className={styles.actionButtons}>
        <Button
          variant={ButtonVariant.Danger}
          onClick={handleConfirm}
          disabled={!canUnenrol || isUnenrolling}
          iconStart={<IconTrash aria-hidden="true" />}
          className={styles.confirmButton}
        >
          {t(
            'event.cancellation.modal.confirmButton',
            'Peruuta ilmoittautuminen'
          )}
        </Button>
        <Button
          onClick={() => setIsOpen(false)}
          variant={ButtonVariant.Secondary}
          disabled={isUnenrolling}
        >
          {t(
            'event.cancellation.modal.keepButton',
            'Säilytä ilmoittautuminen'
          )}
        </Button>
      </Dialog.ActionButtons>
    </Dialog>
  );
};

export default UnenrolModal;
