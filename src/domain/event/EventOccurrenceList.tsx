import { useTranslation } from 'react-i18next';

import { eventQuery_event_occurrences as Occurrences } from '../api/generatedTypes/eventQuery';
import EventOccurrence from './EventOccurrence';
import styles from './eventOccurrenceList.module.scss';

type EventOccurrenceListProps = {
  occurrences: Occurrences;
  showFreePlaces?: boolean;
};

const EventOccurrenceList = ({
  occurrences,
  showFreePlaces = true,
}: EventOccurrenceListProps) => {
  const { t } = useTranslation();

  return (
    <table className={styles.eventOccurrenceList}>
      <tbody>
        <tr className={styles.mobileHeader}>
          <th>{t('event.register.occurrenceTableHeader.eventInformation')}</th>
          {showFreePlaces && (
            <th>{t('event.register.occurrenceTableHeader.freePlaces')}</th>
          )}
        </tr>

        <tr className={styles.desktopHeader}>
          <th>{t('event.register.occurrenceTableHeader.date')}</th>
          <th>{t('event.register.occurrenceTableHeader.time')}</th>
          <th>{t('event.register.occurrenceTableHeader.venue')}</th>
          {showFreePlaces && (
            <th className={styles.freePlaces}>
              {t('event.register.occurrenceTableHeader.freePlaces')}
            </th>
          )}
          <th></th>
        </tr>

        {occurrences.edges.map((edge) =>
          edge?.node ? (
            <EventOccurrence
              key={edge.node.id}
              occurrence={edge.node}
              showFreePlaces={showFreePlaces}
            />
          ) : null
        )}
      </tbody>
    </table>
  );
};

export default EventOccurrenceList;
