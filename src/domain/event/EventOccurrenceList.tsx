import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import { eventQuery_event_occurrences as Occurrences } from '../api/generatedTypes/eventQuery';
import EventOccurrence from './EventOccurrence';
import styles from './eventOccurrenceList.module.scss';

interface EventOccurrenceListProps {
  occurrences: Occurrences;
  eventId: string;
}

const EventOccurrenceList: FunctionComponent<EventOccurrenceListProps> = ({
  occurrences,
}) => {
  const { t } = useTranslation();
  return (
    <table className={styles.eventOccurrenceList}>
      <tbody>
        <tr className={styles.mobileHeader}>
          <th>{t('event.register.occurrenceTableHeader.eventInformation')}</th>
          <th>{t('event.register.occurrenceTableHeader.freePlaces')}</th>
        </tr>

        <tr className={styles.desktopHeader}>
          <th>{t('event.register.occurrenceTableHeader.date')}</th>
          <th>{t('event.register.occurrenceTableHeader.time')}</th>
          <th>{t('event.register.occurrenceTableHeader.venue')}</th>
          <th>{t('event.register.occurrenceTableHeader.freePlaces')}</th>
          <th></th>
        </tr>

        {occurrences.edges.map(edge =>
          edge?.node ? (
            <EventOccurrence key={edge.node.id} occurrence={edge.node} />
          ) : null
        )}
      </tbody>
    </table>
  );
};

export default EventOccurrenceList;
