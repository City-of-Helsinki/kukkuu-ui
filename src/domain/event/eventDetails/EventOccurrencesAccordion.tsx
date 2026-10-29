import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { isOccurrenceFull, sortOccurrencesByTime } from '../EventUtils';
import type {
  EventOccurrencesTableEvent,
  EventOccurrencesTableOccurrence,
} from './EventOccurrencesTable';
import { EventOccurrenceAccordionItem } from './EventOccurrenceAccordionItem';
import styles from './eventOccurrencesTable.module.scss';

export type EventOccurrencesAccordionProps = {
  event: EventOccurrencesTableEvent;
  occurrences: EventOccurrencesTableOccurrence[];
  childId: string;
  enrolledOccurrenceId?: string | null;
  onEnrol: (occurrence: EventOccurrencesTableOccurrence) => void;
  onCancelEnrolment?: (occurrence: EventOccurrencesTableOccurrence) => void;
  onSubscribe: (occurrence: EventOccurrencesTableOccurrence) => void;
  onUnsubscribe: (occurrence: EventOccurrencesTableOccurrence) => void;
  onVenueInfoClick?: (venue: NonNullable<EventOccurrencesTableOccurrence['venue']>) => void;
};

/**
 * Mobile view for event occurrences using HDS Accordions.
 *
 * Implements smart default expansion:
 * 1. Expands the enrolled occurrence if the child is already enrolled in one.
 * 2. Otherwise expands the first available occurrence with remaining spots.
 * 3. Keeps all collapsed if all occurrences are full.
 */
export const EventOccurrencesAccordion: React.FC<
  EventOccurrencesAccordionProps
> = ({
  event,
  occurrences,
  childId,
  enrolledOccurrenceId,
  onEnrol,
  onCancelEnrolment,
  onSubscribe,
  onUnsubscribe,
  onVenueInfoClick,
}) => {
  const { t } = useTranslation();

  const sortedOccurrences = useMemo(() => {
    return sortOccurrencesByTime(occurrences);
  }, [occurrences]);

  const initiallyOpenOccurrenceId = useMemo(() => {
    if (enrolledOccurrenceId) {
      const enrolledExists = sortedOccurrences.some(
        (occ) => occ.id === enrolledOccurrenceId
      );
      if (enrolledExists) return enrolledOccurrenceId;
    }

    const firstAvailable = sortedOccurrences.find(
      (occ) => !isOccurrenceFull(occ.remainingCapacity)
    );
    return firstAvailable?.id ?? null;
  }, [sortedOccurrences, enrolledOccurrenceId]);

  if (sortedOccurrences.length === 0) {
    return (
      <p className={styles.noOccurrences}>
        {t('event.occurrencesTable.noOccurrences')}
      </p>
    );
  }

  return (
    <div className={styles.accordionList}>
      {sortedOccurrences.map((occ) => (
        <EventOccurrenceAccordionItem
          key={occ.id}
          occurrence={occ}
          event={event}
          childId={childId}
          enrolledOccurrenceId={enrolledOccurrenceId}
          initiallyOpen={occ.id === initiallyOpenOccurrenceId}
          onEnrol={onEnrol}
          onCancelEnrolment={onCancelEnrolment}
          onSubscribe={onSubscribe}
          onUnsubscribe={onUnsubscribe}
          onVenueInfoClick={onVenueInfoClick}
        />
      ))}
    </div>
  );
};

export default EventOccurrencesAccordion;
