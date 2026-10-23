import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ContentContainer } from '@city-of-helsinki/react-helsinki-headless-cms';

import EventOccurrencesTable, {
  EventOccurrencesTableEvent,
  EventOccurrencesTableOccurrence,
} from './EventOccurrencesTable';
import EnrolOccurrenceModal from '../modal/EnrolOccurrenceModal';
import UnenrolModal from '../modal/UnenrolModal';
import EventNotificationSubscriptionModal from '../EventNotificationSubscriptionModal';
import useUnsubscribeFromFreeSpotNotificationMutation from '../useUnsubscribeFromFreeSpotNotificationMutation';
import { useChildEnrolment } from '../hooks/useChildEnrolment';
import { EventParticipantsPerInvite } from '../../api/generatedTypes/graphql';
import styles from './eventOccurrencesTable.module.scss';

export type EventOccurrencesTableSectionProps = {
  event: EventOccurrencesTableEvent & {
    shortDescription?: string | null;
    participantsPerInvite?: EventParticipantsPerInvite | null;
    eventGroup?: { id: string } | null;
  };
  occurrences: EventOccurrencesTableOccurrence[];
  childId: string;
};

export const EventOccurrencesTableSection: React.FC<
  EventOccurrencesTableSectionProps
> = ({ event, occurrences, childId }) => {
  const { t } = useTranslation();

  const enrolmentInfo = useChildEnrolment(childId, event.id);

  const [enrollingOccurrence, setEnrollingOccurrence] =
    useState<EventOccurrencesTableOccurrence | null>(null);

  const [cancellingOccurrence, setCancellingOccurrence] =
    useState<EventOccurrencesTableOccurrence | null>(null);

  const [subscribingOccurrence, setSubscribingOccurrence] =
    useState<EventOccurrencesTableOccurrence | null>(null);

  const [unsubscribe] = useUnsubscribeFromFreeSpotNotificationMutation(
    event.id,
    childId
  );

  const handleUnsubscribe = async (
    occ: EventOccurrencesTableOccurrence
  ) => {
    await unsubscribe({
      variables: {
        input: {
          childId,
          occurrenceId: occ.id,
        },
      },
    });
  };

  return (
    <section
      className={styles.occurrencesTableSection}
      aria-labelledby="occurrences-table"
    >
      <ContentContainer>
        <hr className={styles.divider} />
        <h2 id="occurrences-table" className={styles.heading}>
          {t('event.occurrencesTable.title')}
        </h2>

        <EventOccurrencesTable
          event={event}
          occurrences={occurrences}
          childId={childId}
          enrolledOccurrenceId={enrolmentInfo.enrolledOccurrenceId}
          onEnrol={(occ) => setEnrollingOccurrence(occ)}
          onCancelEnrolment={(occ) => setCancellingOccurrence(occ)}
          onSubscribe={(occ) => setSubscribingOccurrence(occ)}
          onUnsubscribe={handleUnsubscribe}
        />
      </ContentContainer>

      {cancellingOccurrence && (
        <UnenrolModal
          isOpen={Boolean(cancellingOccurrence)}
          setIsOpen={(open) => {
            if (!open) setCancellingOccurrence(null);
          }}
          childId={childId}
          occurrenceId={cancellingOccurrence.id}
          eventId={event.id}
          eventGroupId={event.eventGroup?.id}
          occurrence={{
            id: cancellingOccurrence.id,
            time: cancellingOccurrence.time,
            venue: cancellingOccurrence.venue,
            event: {
              id: event.id,
              name: event.name || '',
              duration: event.duration,
              eventGroup: event.eventGroup,
            },
          }}
          event={{
            id: event.id,
            name: event.name || '',
            duration: event.duration,
            eventGroup: event.eventGroup,
          }}
          childName={enrolmentInfo.childName}
        />
      )}

      {enrollingOccurrence && (
        <EnrolOccurrenceModal
          isOpen={Boolean(enrollingOccurrence)}
          onClose={() => setEnrollingOccurrence(null)}
          childId={childId}
          occurrence={{
            ...enrollingOccurrence,
          }}
          event={{
            ...event,
            name: event.name || '',
          }}
        />
      )}

      {subscribingOccurrence && (
        <EventNotificationSubscriptionModal
          childId={childId}
          eventId={event.id}
          eventOccurrence={{
            ...subscribingOccurrence,
            event: {
              name: event.name ?? null,
            },
          }}
          isOpen={Boolean(subscribingOccurrence)}
          setIsOpen={(isOpen) => {
            if (!isOpen) setSubscribingOccurrence(null);
          }}
          onSubscribed={() => setSubscribingOccurrence(null)}
        />
      )}
    </section>
  );
};

export default EventOccurrencesTableSection;
