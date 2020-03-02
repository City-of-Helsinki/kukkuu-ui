import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { eventQuery_event_occurrences_edges_node as OccurrencesEdgeNode } from '../api/generatedTypes/eventQuery';
import Button from '../../common/components/button/Button';
import { formatTime, newMoment } from '../../common/time/utils';
import styles from './eventOccurrence.module.scss';

interface EventOccurrenceProps {
  occurrence: OccurrencesEdgeNode;
}

const EventOccurrence: React.FunctionComponent<EventOccurrenceProps> = ({
  occurrence,
}) => {
  const { t } = useTranslation();

  // TODO: Ensure that date shows in correct locale.
  const date = formatTime(newMoment(occurrence.time), 'dd l');
  const time = formatTime(newMoment(occurrence.time), 'hh:mm');

  return (
    <tr className={styles.occurrence}>
      <td>{date}</td>
      <td>{time}</td>
      <td>
        {occurrence.venue.name} {occurrence.venue.description}
      </td>
      <td>999</td>
      <td>
        <Button type="submit" className={styles.submitButton}>
          {t('event.register.occurrenceTableHeader.buttonText')}
        </Button>
      </td>
    </tr>
  );
};

export default EventOccurrence;
