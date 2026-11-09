import React from 'react';
import { useTranslation } from 'react-i18next';
import { Accordion } from 'hds-react';

import { DEFAULT_TIME_FORMAT } from '../../../common/time/TimeConstants';
import {
  formatOccurrenceDateLong,
  formatOccurrenceTimeRange,
} from '../../../common/time/occurrenceTime';
import { formatTime, newDate } from '../../../common/time/utils';
import { getCurrentLanguage } from '../../../common/translation/TranslationUtils';
import type {
  EventOccurrencesTableEvent,
  EventOccurrencesTableOccurrence,
} from './EventOccurrencesTable';
import { getOccurrenceStatus } from './occurrenceStatus';
import { useOccurrenceFeatures } from '../hooks/useOccurrenceFeatures';
import { OccurrenceAccordionHeading } from './components/OccurrenceAccordionHeading';
import { OccurrenceDetailsList } from './components/OccurrenceDetailsList';

export type EventOccurrenceAccordionItemProps = {
  occurrence: EventOccurrencesTableOccurrence;
  event: EventOccurrencesTableEvent;
  childId: string;
  enrolledOccurrenceId?: string | null;
  initiallyOpen?: boolean;
  onEnrol: (occurrence: EventOccurrencesTableOccurrence) => void;
  onCancelEnrolment?: (occurrence: EventOccurrencesTableOccurrence) => void;
  onSubscribe: (occurrence: EventOccurrencesTableOccurrence) => void;
  onUnsubscribe: (occurrence: EventOccurrencesTableOccurrence) => void;
  onVenueInfoClick?: (
    venue: NonNullable<EventOccurrencesTableOccurrence['venue']>
  ) => void;
};

/**
 * Mobile HDS Accordion card representing an individual occurrence matching Figma designs:
 * 2-line header with date, start time, remaining capacity badge, and special feature icons;
 * expanded body displaying time range, venue link, address, languages, accessibilities,
 * and the primary action button.
 */
export const EventOccurrenceAccordionItem: React.FC<
  EventOccurrenceAccordionItemProps
> = ({
  occurrence,
  event,
  childId,
  enrolledOccurrenceId,
  initiallyOpen = false,
  onEnrol,
  onCancelEnrolment,
  onSubscribe,
  onUnsubscribe,
  onVenueInfoClick,
}) => {
  const { i18n } = useTranslation();

  const formattedDate = formatOccurrenceDateLong(
    occurrence.time,
    i18n.language
  );
  const startTime = formatTime(newDate(occurrence.time), DEFAULT_TIME_FORMAT);
  const formattedTimeRange = formatOccurrenceTimeRange(
    occurrence.time,
    event.duration
  );

  const isEnrolledHere = enrolledOccurrenceId === occurrence.id;
  const status = getOccurrenceStatus({
    remainingCapacity: occurrence.remainingCapacity,
    isEnrolledHere,
  });

  const { languageText, accessibilities, isSpeechless } =
    useOccurrenceFeatures(occurrence);

  const heading = (
    <OccurrenceAccordionHeading
      formattedDate={formattedDate}
      formattedStartTime={startTime}
      status={status}
      remainingCapacity={occurrence.remainingCapacity}
      accessibilities={accessibilities}
      speechless={isSpeechless}
    />
  );

  return (
    <Accordion
      card
      border
      closeButton
      initiallyOpen={initiallyOpen}
      heading={heading as unknown as string}
      headingLevel={3}
      language={getCurrentLanguage(i18n)}
      id={`occurrence-accordion-${occurrence.id}`}
    >
      <OccurrenceDetailsList
        occurrence={occurrence}
        event={event}
        childId={childId}
        enrolledOccurrenceId={enrolledOccurrenceId}
        formattedTimeRange={formattedTimeRange}
        languageText={languageText}
        accessibilities={accessibilities}
        onEnrol={onEnrol}
        onCancelEnrolment={onCancelEnrolment}
        onSubscribe={onSubscribe}
        onUnsubscribe={onUnsubscribe}
        onVenueInfoClick={onVenueInfoClick}
      />
    </Accordion>
  );
};

export default EventOccurrenceAccordionItem;
