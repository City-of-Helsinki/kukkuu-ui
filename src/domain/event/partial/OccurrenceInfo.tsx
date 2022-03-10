import { useTranslation } from 'react-i18next';
import joinClassNames from 'classnames';

import clockIcon from '../../../assets/icons/svg/clock.svg';
import calendarIcon from '../../../assets/icons/svg/calendar.svg';
import locationIcon from '../../../assets/icons/svg/location.svg';
import { formatTime, newMoment } from '../../../common/time/utils';
import { DEFAULT_DATE_FORMAT } from '../../../common/time/TimeConstants';
import { childByIdQuery_child_occurrences_edges_node as OccurrenceType } from '../../api/generatedTypes/childByIdQuery';
import { occurrenceQuery_occurrence as OccurrenceQueryType } from '../../api/generatedTypes/occurrenceQuery';
import { formatOccurrenceTime, getParticipantsIcon } from '../EventUtils';
import InfoItem from './InfoItem';
import styles from './occurrenceInfo.module.scss';

type Props = {
  className?: string;
  occurrence: OccurrenceQueryType | OccurrenceType;
  show?: string[];
  center?: boolean;
};

export type InfoItem = {
  id: string;
  className?: string;
  iconSrc: string;
  iconAlt?: string;
  label: string;
  description?: string;
  fullWidth?: boolean;
};

const OccurrenceInfo = ({
  className,
  occurrence,
  show = ['time', 'duration', 'participants', 'venue'],
  center = false,
}: Props) => {
  const { t } = useTranslation();

  const infoItems: InfoItem[] = [
    {
      id: 'venue',
      iconSrc: locationIcon,
      iconAlt: t('event.register.occurrenceTableHeader.venue'),
      label: occurrence.venue.name || '',
      description: occurrence.venue.address || undefined,
      fullWidth: true,
    },
    {
      id: 'time',
      iconSrc: calendarIcon,
      iconAlt: t('event.register.occurrenceTableHeader.date'),
      label: formatTime(newMoment(occurrence.time), DEFAULT_DATE_FORMAT),
    },
    {
      id: 'duration',
      iconSrc: clockIcon,
      iconAlt: t('event.register.occurrenceTableHeader.time'),
      label: formatOccurrenceTime(occurrence.time, occurrence.event.duration),
    },
    {
      id: 'participants',
      iconSrc: getParticipantsIcon(occurrence.event.participantsPerInvite),
      iconAlt: t('event.register.participants'),
      label: t(
        `event.participantsPerInviteEnum.${occurrence.event.participantsPerInvite}`
      ),
    },
  ];

  return (
    <div
      className={joinClassNames(
        className,
        styles.row,
        center ? styles.center : ''
      )}
    >
      {infoItems.map(
        (item, index) =>
          show.some((id) => id === item.id) && (
            <InfoItem
              key={index}
              className={joinClassNames(
                className,
                styles.label,
                item.className
              )}
              iconSrc={item.iconSrc}
              iconAlt={item.iconAlt}
              label={item.label}
              description={item.description}
              fullWidth={item.fullWidth}
            />
          )
      )}
    </div>
  );
};

export default OccurrenceInfo;
