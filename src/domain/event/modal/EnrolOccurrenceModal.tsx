import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  ButtonVariant,
  Checkbox,
  Dialog,
  IconCheckCircle,
  IconClock,
  IconGroup,
  IconLocation,
} from 'hds-react';

import {
  formatOccurrenceDateLong,
  formatOccurrenceTimeRange,
} from '../../../common/time/occurrenceTime';
import { EventParticipantsPerInvite } from '../../api/generatedTypes/graphql';
import { useProfileContext } from '../../profile/hooks/useProfileContext';
import { useEnrolOccurrenceMutation } from '../hooks/useEnrolOccurrenceMutation';
import styles from './enrolOccurrenceModal.module.scss';

export type EnrolOccurrenceModalVenue = {
  name?: string | null;
  address?: string | null;
};

export type EnrolOccurrenceModalOccurrence = {
  id: string;
  time: string;
  remainingCapacity?: number | null;
  occurrenceLanguage?: string | null;
  venue?: EnrolOccurrenceModalVenue | null;
};

export type EnrolOccurrenceModalEvent = {
  id: string;
  name?: string | null;
  shortDescription?: string | null;
  duration?: number | null;
  participantsPerInvite?: EventParticipantsPerInvite | null;
  eventGroup?: { id: string } | null;
};

export type EnrolOccurrenceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  childId: string;
  occurrence: EnrolOccurrenceModalOccurrence;
  event: EnrolOccurrenceModalEvent;
};

export const EnrolOccurrenceModal: React.FC<EnrolOccurrenceModalProps> = ({
  isOpen,
  onClose,
  childId,
  occurrence,
  event,
}) => {
  const { t, i18n } = useTranslation();
  const { profile } = useProfileContext();

  const titleId = 'enrol-occurrence-dialog-title';
  const descriptionId = 'enrol-occurrence-dialog-description';

  const child = profile?.children?.edges
    ?.map((edge) => edge?.node)
    ?.find((c) => c?.id === childId);

  const childName = child?.name || t('profile.child.default.name.text');
  const guardianName = [profile?.firstName, profile?.lastName]
    .filter(Boolean)
    .join(' ');
  const guardianLabel = guardianName
    ? t('event.enrolModal.guardianYou', { name: guardianName })
    : t('event.enrolModal.defaultGuardian');

  const formattedDate = formatOccurrenceDateLong(
    occurrence.time,
    i18n.language
  );
  const formattedTime = formatOccurrenceTimeRange(
    occurrence.time,
    event.duration
  );
  const formattedDateTime =
    formattedDate && formattedTime
      ? `${formattedDate} ${t('common.dateTimeSeparator', 'klo')} ${formattedTime}`
      : formattedDate || formattedTime;

  const venueText = [occurrence.venue?.name, occurrence.venue?.address]
    .filter(Boolean)
    .join(', ');

  const audienceText = event.participantsPerInvite
    ? t(`event.participantsPerInviteEnum.${event.participantsPerInvite}`)
    : undefined;

  const [enrolOccurrence, { loading: isEnrolling }] =
    useEnrolOccurrenceMutation({
      childId,
      eventId: event.id,
      eventGroupId: event.eventGroup?.id,
      onClose,
    });

  const handleConfirm = async () => {
    try {
      await enrolOccurrence(occurrence.id);
    } catch {
      // Errors handled in hook onError
    }
  };

  return (
    <Dialog
      id="enrol-occurrence-dialog"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      isOpen={isOpen}
      close={onClose}
      closeButtonLabelText={t('common.closeButton.altText')}
      variant="primary"
      className={styles.modal}
    >
      <Dialog.Header id={titleId} title={t('event.enrolModal.title')} />
      <Dialog.Content>
        <div id={descriptionId}>
          <h3 className={styles.eventTitle}>{event.name}</h3>

          <div className={styles.detailsList}>
            {formattedDateTime && (
              <div className={styles.detailRow}>
                <IconClock aria-hidden="true" className={styles.icon} />
                <span>{formattedDateTime}</span>
              </div>
            )}

            {venueText && (
              <div className={styles.detailRow}>
                <IconLocation aria-hidden="true" className={styles.icon} />
                <span>{venueText}</span>
              </div>
            )}

            {audienceText && (
              <div className={styles.detailRow}>
                <IconGroup aria-hidden="true" className={styles.icon} />
                <div>
                  <strong>{t('event.enrolModal.forWhom')}:</strong>{' '}
                  {audienceText}
                </div>
              </div>
            )}

            {typeof occurrence.remainingCapacity === 'number' && (
              <div className={styles.detailRow}>
                <IconCheckCircle aria-hidden="true" className={styles.icon} />
                <span>
                  {t('event.enrolModal.freeSpots', {
                    count: occurrence.remainingCapacity,
                  })}
                </span>
              </div>
            )}
          </div>

          <div className={styles.participantsSection}>
            <h4 className={styles.participantsTitle}>
              {t('event.enrolModal.participantsTitle')}
            </h4>

            <div className={styles.groupLabel}>
              {t('event.enrolModal.cultureKidsLabel')}
            </div>
            <div className={styles.checkboxWrapper}>
              <Checkbox
                id={`enrol-child-${childId}`}
                label={childName}
                checked
                readOnly
                onChange={() => {}}
              />
            </div>

            <div className={styles.groupLabel}>
              {t('event.enrolModal.guardianLabel')}
            </div>
            <div className={styles.checkboxWrapper}>
              <Checkbox
                id={`enrol-guardian-${childId}`}
                label={guardianLabel}
                checked
                readOnly
                onChange={() => {}}
              />
            </div>

            <div className={styles.noticesWrapper}>
              <p className={styles.noticeText}>
                {t('event.enrolModal.quotaNotice', { name: childName })}
              </p>
              <p className={styles.noticeText}>
                {t('event.enrolModal.bindingNotice')}
              </p>
            </div>
          </div>
        </div>
      </Dialog.Content>
      <Dialog.ActionButtons className={styles.actionButtons}>
        <Button
          onClick={handleConfirm}
          disabled={isEnrolling}
          className={styles.confirmButton}
        >
          {t('event.enrolModal.confirmButton')}
        </Button>
        <Button
          onClick={onClose}
          variant={ButtonVariant.Secondary}
          disabled={isEnrolling}
          className={styles.cancelButton}
        >
          {t('event.enrolModal.cancelButton')}
        </Button>
      </Dialog.ActionButtons>
    </Dialog>
  );
};

export default EnrolOccurrenceModal;
