import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import {
  Button,
  ButtonPresetTheme,
  ButtonVariant,
  Dialog,
  IconCalendar,
  IconCheck,
  IconClock,
  IconFaceSmile,
  IconLocation,
  IconTrash,
  IconUser,
  Notification,
  NotificationSize,
  NumberInput,
} from 'hds-react';

import Icon from '../../../common/components/icon/Icon';
import { publicSvgIconPaths } from '../../../public_files';
import useGetPathname from '../../../common/route/utils/useGetPathname';
import {
  EventParticipantsPerInvite,
} from '../../api/generatedTypes/graphql';
import { useProfileContext } from '../../profile/hooks/useProfileContext';
import {
  formatOccurrenceDateLong,
  formatOccurrenceTimeRange,
} from '../../../common/time/occurrenceTime';
import { useEnrolOccurrenceMutation } from '../hooks/useEnrolOccurrenceMutation';
import UnenrolModal from './UnenrolModal';
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
  registrationOpensAt?: string | null;
  eventGroup?: {
    id: string;
  } | null;
};

export type EnrolOccurrenceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  childId: string;
  occurrence: EnrolOccurrenceModalOccurrence;
  event: EnrolOccurrenceModalEvent;
};

type ModalView = 'form' | 'success';

/**
 * Accessible modal dialog for enrolling a child into an occurrence.
 * Features:
 * - Yellow summary card with event title, date/time, and venue
 * - Clean participants section with Kulttuurilapsi and Lähiaikuinen
 * - HDS NumberInput steppers for extra children & extra adults in FAMILY events
 * - Dynamic capacity bounds respecting remaining occurrence seats
 * - Blue info box for pre-registration awareness
 * - In-modal success confirmation view following Figma design
 * - Smooth transition to UnenrolModal on cancellation
 * - Focus restoration adhering to WCAG 2.2 AA
 */
export const EnrolOccurrenceModal: React.FC<EnrolOccurrenceModalProps> = ({
  isOpen,
  onClose,
  childId,
  occurrence,
  event,
}) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const getPathname = useGetPathname();
  const { profile } = useProfileContext();

  const onProfilePage =
    location.pathname.replace(/\/$/, '') ===
    getPathname('/profile').replace(/\/$/, '');

  const [modalView, setModalView] = useState<ModalView>('form');
  const [extraChildren, setExtraChildren] = useState(0);
  const [extraAdults, setExtraAdults] = useState(0);
  const [isUnenrolOpen, setIsUnenrolOpen] = useState(false);

  // Dialog ARIA IDs
  const titleId = 'enrol-occurrence-dialog-title';
  const descriptionId = 'enrol-occurrence-dialog-desc';

  // Reset modal view and state when dialog opens or closes
  useEffect(() => {
    if (isOpen) {
      setModalView('form');
      setExtraChildren(0);
      setExtraAdults(0);
      setIsUnenrolOpen(false);
    }
  }, [isOpen]);

  // Manage focus when switching views
  useEffect(() => {
    if (modalView === 'success') {
      const headerHeading = document.getElementById(titleId);
      headerHeading?.focus();
    }
  }, [modalView]);

  const child = profile?.children?.edges
    ?.map((edge) => edge?.node)
    ?.find((c) => c?.id === childId);

  const childName = child?.name || t('profile.child.default.name.text');
  const guardianName = [profile?.firstName, profile?.lastName]
    .filter(Boolean)
    .join(' ');

  const formattedDate = formatOccurrenceDateLong(
    occurrence.time,
    i18n.language
  );
  const formattedTime = formatOccurrenceTimeRange(
    occurrence.time,
    event.duration
  );

  const venueText = [occurrence.venue?.name, occurrence.venue?.address]
    .filter(Boolean)
    .join(', ');

  const isFamily =
    event.participantsPerInvite === EventParticipantsPerInvite.Family;

  // Dynamic capacity calculations
  const remaining = occurrence.remainingCapacity;
  const maxPossibleChildrenByCapacity =
    remaining != null ? Math.max(0, remaining - 2 - extraAdults) : 3;
  const maxExtraChildren = Math.min(3, maxPossibleChildrenByCapacity);

  const maxPossibleAdultsByCapacity =
    remaining != null ? Math.max(0, remaining - 2 - extraChildren) : 1;
  const maxExtraAdults = Math.min(1, maxPossibleAdultsByCapacity);

  const extraChildrenHelperText = (() => {
    if (maxExtraChildren <= 0 && extraChildren <= 0) {
      return t('event.enrolModal.extraChildren.helperText_none');
    }
    if (maxExtraChildren === 1) {
      return t('event.enrolModal.extraChildren.helperText_one');
    }
    if (maxExtraChildren === 2) {
      return t('event.enrolModal.extraChildren.helperText_two');
    }
    return t('event.enrolModal.extraChildren.helperText');
  })();

  const extraAdultsHelperText = (() => {
    if (maxExtraAdults <= 0 && extraAdults <= 0) {
      return t('event.enrolModal.extraAdults.helperText_none');
    }
    return t('event.enrolModal.extraAdults.helperText');
  })();

  const [enrolOccurrence, { loading: isEnrolling }] =
    useEnrolOccurrenceMutation({
      childId,
      eventId: event.id,
      eventGroupId: event.eventGroup?.id,
      registrationOpensAt: event.registrationOpensAt,
      onClose,
      stayInModalOnSuccess: true,
      onSuccess: () => {
        setModalView('success');
      },
    });

  const handleConfirm = async () => {
    try {
      await enrolOccurrence(
        occurrence.id,
        isFamily
          ? {
            extraChildrenCount: extraChildren,
            extraGuardiansCount: extraAdults,
          }
          : undefined
      );
    } catch {
      // Errors handled in hook onError
    }
  };

  const handleExtraChildrenChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const val = Number.parseInt(e.target.value, 10);
    if (Number.isNaN(val)) {
      setExtraChildren(0);
    } else {
      setExtraChildren(Math.min(maxExtraChildren, Math.max(0, val)));
    }
  };

  const handleExtraAdultsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number.parseInt(e.target.value, 10);
    if (Number.isNaN(val)) {
      setExtraAdults(0);
    } else {
      setExtraAdults(Math.min(maxExtraAdults, Math.max(0, val)));
    }
  };

  const handleGoToEvents = () => {
    onClose();
    if (!onProfilePage) {
      const profilePath = childId
        ? `${getPathname('/profile')}?child=${encodeURIComponent(childId)}`
        : getPathname('/profile');
      navigate(profilePath);
    }
  };

  const handleOpenUnenrol = () => {
    setIsUnenrolOpen(true);
  };

  const handleUnenrolModalChange = (open: boolean) => {
    setIsUnenrolOpen(open);
    if (!open) {
      onClose();
    }
  };

  const renderEventCard = () => (
    <div className={styles.eventCard}>
      <h3 id={descriptionId} className={styles.eventTitle}>
        {event.name}
      </h3>

      {modalView === 'success' && (
        <div className={styles.enrolledBadge}>
          <IconCheck aria-hidden="true" className={styles.badgeIcon} />
          <span>
            {t('event.enrolModal.success.enrolledBadge', { name: childName })}
          </span>
        </div>
      )}

      <div className={styles.detailsList}>
        <div className={styles.detailRow}>
          {formattedDate && (
            <div className={styles.metaInline}>
              <IconCalendar aria-hidden="true" className={styles.icon} />
              <span>{formattedDate}</span>
            </div>
          )}
          {formattedTime && (
            <div className={styles.metaInline}>
              <IconClock aria-hidden="true" className={styles.icon} />
              <span>{`${t('common.dateTimeSeparator', 'klo')} ${formattedTime}`}</span>
            </div>
          )}
        </div>

        {venueText && (
          <div className={styles.detailRow}>
            <div className={styles.metaInline}>
              <IconLocation aria-hidden="true" className={styles.icon} />
              <span>{venueText}</span>
            </div>
          </div>
        )}

        {modalView === 'success' && (
          <>
            <div className={styles.detailRow}>
              <div className={styles.metaInline}>
                <IconFaceSmile aria-hidden="true" className={styles.icon} />
                <span>
                  {extraChildren > 0
                    ? t('event.enrolModal.success.extraChildrenSummary', {
                      name: childName,
                      count: extraChildren,
                    })
                    : childName}
                </span>
              </div>
            </div>

            <div className={styles.detailRow}>
              <div className={styles.metaInline}>
                <IconUser aria-hidden="true" className={styles.icon} />
                <span>
                  {extraAdults > 0
                    ? t('event.enrolModal.success.extraAdultsSummary', {
                      name: guardianName || t('event.enrolModal.defaultGuardian'),
                      count: extraAdults,
                    })
                    : guardianName || t('event.enrolModal.defaultGuardian')}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      <Dialog
        id="enrol-occurrence-dialog"
        aria-labelledby={titleId}
        aria-describedby={modalView === 'form' ? descriptionId : undefined}
        isOpen={isOpen && !isUnenrolOpen}
        close={onClose}
        closeButtonLabelText={t('common.closeButton.altText')}
        variant="primary"
        className={styles.modal}
      >
        {modalView === 'form' ? (
          <>
            <Dialog.Header id={titleId} title={t('event.enrolModal.title')} />
            <Dialog.Content>
              <div>
                {renderEventCard()}

                <div className={styles.participantsSection}>
                  <h4 className={styles.participantsTitle}>
                    {t('event.enrolModal.participantsTitle')}
                  </h4>

                  <div className={styles.participantBlock}>
                    <span className={styles.participantLabel}>
                      {t('event.enrolModal.cultureKidLabel')}
                    </span>
                    <span className={styles.participantName}>{childName}</span>
                    {isFamily && (
                      <div className={styles.stepperWrapper}>
                        <NumberInput
                          id="extra-children-input"
                          label={t('event.enrolModal.extraChildren.label')}
                          helperText={extraChildrenHelperText}
                          min={0}
                          max={maxExtraChildren}
                          step={1}
                          value={extraChildren}
                          disabled={maxExtraChildren <= 0 && extraChildren <= 0}
                          onChange={handleExtraChildrenChange}
                          minusStepButtonAriaLabel={t(
                            'event.enrolModal.extraChildren.minusAria'
                          )}
                          plusStepButtonAriaLabel={t(
                            'event.enrolModal.extraChildren.plusAria'
                          )}
                        />
                      </div>
                    )}
                  </div>

                  <div className={styles.participantBlock}>
                    <span className={styles.participantLabel}>
                      {t('event.enrolModal.guardianLabel')}
                    </span>
                    <span className={styles.participantName}>
                      {guardianName || t('event.enrolModal.defaultGuardian')}
                    </span>
                    {isFamily && (
                      <div className={styles.stepperWrapper}>
                        <NumberInput
                          id="extra-adults-input"
                          label={t('event.enrolModal.extraAdults.label')}
                          helperText={extraAdultsHelperText}
                          min={0}
                          max={maxExtraAdults}
                          step={1}
                          value={extraAdults}
                          disabled={maxExtraAdults <= 0 && extraAdults <= 0}
                          onChange={handleExtraAdultsChange}
                          minusStepButtonAriaLabel={t(
                            'event.enrolModal.extraAdults.minusAria'
                          )}
                          plusStepButtonAriaLabel={t(
                            'event.enrolModal.extraAdults.plusAria'
                          )}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <Notification
                  type="info"
                  size={NotificationSize.Small}
                  className={styles.notification}
                >
                  {t('event.enrolModal.noticePreRegisteredOnly')}
                </Notification>

                <div className={styles.noticesWrapper}>
                  <p className={styles.noticeText}>
                    {t('event.enrolModal.bindingNotice')}
                  </p>
                </div>
              </div>
            </Dialog.Content>
            <Dialog.ActionButtons className={styles.actionButtons}>
              <Button
                theme={ButtonPresetTheme.Black}
                onClick={handleConfirm}
                disabled={isEnrolling}
              >
                {t('event.enrolModal.confirmButton')}
              </Button>
              <Button
                onClick={onClose}
                variant={ButtonVariant.Secondary}
                theme={ButtonPresetTheme.Black}
                disabled={isEnrolling}
              >
                {t('event.enrolModal.cancelButton')}
              </Button>
            </Dialog.ActionButtons>
          </>
        ) : (
          <>
            <Dialog.Header
              id={titleId}
              title={t('event.enrolModal.success.title')}
            />
            <Dialog.Content>
              <div>
                <div className={styles.tadaWrapper}>
                  <Icon
                    src={publicSvgIconPaths['tada']}
                    className={styles.successIcon}
                  />
                </div>

                {renderEventCard()}

                <Notification
                  type="info"
                  size={NotificationSize.Small}
                  className={styles.notification}
                >
                  {t('event.enrolModal.noticePreRegisteredOnly')}
                </Notification>

                <div className={styles.noticesWrapper}>
                  <p className={styles.noticeText}>
                    {t('event.enrolModal.bindingNotice')}
                  </p>
                </div>
              </div>
            </Dialog.Content>
            <Dialog.ActionButtons className={styles.actionButtons}>
              <Button
                theme={ButtonPresetTheme.Black}
                onClick={handleGoToEvents}
              >
                {t('event.enrolModal.success.readyButton')}
              </Button>
              <Button
                onClick={handleOpenUnenrol}
                variant={ButtonVariant.Danger}
                iconStart={<IconTrash aria-hidden="true" />}
              >
                {t('event.enrolModal.success.unenrolButton')}
              </Button>
            </Dialog.ActionButtons>
          </>
        )}
      </Dialog>

      {isUnenrolOpen && (
        <UnenrolModal
          isOpen={isUnenrolOpen}
          setIsOpen={handleUnenrolModalChange}
          childId={childId}
          occurrenceId={occurrence.id}
          eventId={event.id}
          eventGroupId={event.eventGroup?.id}
          occurrence={occurrence}
          event={event}
          childName={childName}
          extraChildrenCount={extraChildren}
          extraGuardiansCount={extraAdults}
          onSuccess={onClose}
        />
      )}
    </>
  );
};

export default EnrolOccurrenceModal;
