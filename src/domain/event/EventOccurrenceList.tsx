import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { eventQuery_event_occurrences as Occurrences } from '../api/generatedTypes/eventQuery';
import EventOccurrence from './EventOccurrence';
import styles from './eventOccurrenceList.module.scss';

const EventOccurrenceList: React.FunctionComponent<Occurrences> = eventOccurrenceEdges => {
  const { t } = useTranslation();
  return (
    <table className={styles.eventOccurrenceList}>
      <tbody>
        <tr>
          <th className={styles.header}>
            {t('event.register.occurrenceTableHeader.date')}
          </th>
          <th className={styles.header}>
            {t('event.register.occurrenceTableHeader.time')}
          </th>
          <th className={styles.header}>
            {t('event.register.occurrenceTableHeader.venue')}
          </th>
          <th className={styles.header}>
            {t('event.register.occurrenceTableHeader.freePlaces')}
          </th>
          <th></th>
        </tr>

        {eventOccurrenceEdges.edges.map(edge =>
          edge?.node ? (
            <EventOccurrence key={edge.node.id} occurrence={edge.node} />
          ) : null
        )}
      </tbody>
    </table>
  );
};

export default EventOccurrenceList;
