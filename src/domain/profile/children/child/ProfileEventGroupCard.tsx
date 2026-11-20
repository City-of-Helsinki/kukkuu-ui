import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ButtonPresetTheme,
  IconCalendarEvent,
  IconSearch,
  IconSize,
} from 'hds-react';

import LinkButton from '../../../../common/components/button/LinkButton';
import useGetPathname from '../../../../common/route/utils/useGetPathname';
import { EnrolmentDeniedReason } from '../../../api/generatedTypes/graphql';
import {
  InternalOrTicketSystemEnrolment,
  UpcomingEventGroup,
  UpcomingEventGroupEvent,
} from '../../../child/types/ChildByIdQueryTypes';
import {
  getEarliestRegistrationOpensAt,
  getEnrolmentDeniedNotice,
} from '../../../event/EventUtils';
import InvitationLetterButton from './InvitationLetterButton';
import ProfileEnrolledEventCard from './ProfileEnrolledEventCard';
import styles from './profileChildAccordionItem.module.scss';

export type ProfileEventGroupCardProps = {
  childId: string;
  eventGroup: UpcomingEventGroup;
  groupEnrolments: InternalOrTicketSystemEnrolment[];
  publishedEvents: UpcomingEventGroupEvent[];
  onReadInvitationLetter: (eventGroup: UpcomingEventGroup) => void;
};

const ProfileEventGroupCard: React.FC<ProfileEventGroupCardProps> = ({
  childId,
  eventGroup,
  groupEnrolments,
  publishedEvents,
  onReadInvitationLetter,
}) => {
  const { t } = useTranslation();
  const getPathname = useGetPathname();
  const hasInvitationMessage = Boolean(eventGroup.invitationMessage?.trim());

  const promptText =
    eventGroup.enrolmentDeniedReason ===
    EnrolmentDeniedReason.RegistrationNotOpen
      ? getEnrolmentDeniedNotice({
          t,
          enrolmentDeniedReason: eventGroup.enrolmentDeniedReason,
          registrationOpensAt: getEarliestRegistrationOpensAt(publishedEvents),
        })
      : t('profile.events.searchPrompt');

  return (
    <div
      className={styles.searchPromptCard}
      data-testid={`event-group-box-${eventGroup.id}`}
    >
      <div className={styles.eventGroupHeader}>
        {eventGroup.name && (
          <h5 className={styles.eventGroupHeading}>{eventGroup.name}</h5>
        )}
        <InvitationLetterButton
          eventGroupName={eventGroup.name}
          hasInvitationMessage={hasInvitationMessage}
          onClick={() => onReadInvitationLetter(eventGroup)}
        />
      </div>

      {groupEnrolments.length > 0 ? (
        <div className={styles.groupEnrolledList}>
          {groupEnrolments.map((enrolment) => (
            <ProfileEnrolledEventCard
              key={enrolment.id}
              childId={childId}
              enrolment={enrolment}
            />
          ))}
        </div>
      ) : (
        <div className={styles.searchPromptDashedBox}>
          <div className={styles.searchPromptIcon} aria-hidden="true">
            <IconCalendarEvent size={IconSize.Large} />
          </div>
          <p className={styles.searchPromptText}>{promptText}</p>
          <LinkButton
            to={`${getPathname('/events')}?child=${encodeURIComponent(childId)}`}
            variant="primary"
            theme={ButtonPresetTheme.Black}
            iconStart={<IconSearch aria-hidden="true" />}
          >
            {t('profile.events.searchButton')}
          </LinkButton>
        </div>
      )}
    </div>
  );
};

export default ProfileEventGroupCard;
