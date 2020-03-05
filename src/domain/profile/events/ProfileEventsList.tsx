import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { QRCode } from 'react-qrcode-logo';

import Card from '../../../common/components/card/Card';
import {
  DEFAULT_DATE_FORMAT,
  DEFAULT_TIME_FORMAT,
} from '../../../common/time/TimeConstants';
import { formatTime, newMoment } from '../../../common/time/utils';
import {
  childByIdQuery_child_availableEvents as AvailableEventsTypes,
  childByIdQuery_child_enrolments as EnrolmentsTypes,
  childByIdQuery_child_pastEvents as PastEventsTypes,
  childByIdQuery_child_enrolments_edges_node_occurrence as OccurrenceTypes,
} from '../../api/generatedTypes/childByIdQuery';
import styles from './profileEventsList.module.scss';
import clockIcon from '../../../assets/icons/svg/clock.svg';
import calendarIcon from '../../../assets/icons/svg/calendar.svg';
import locationIcon from '../../../assets/icons/svg/location.svg';
import Icon from '../../../common/components/icon/Icon';

interface ProfileEventsListProps {
  availableEvents: AvailableEventsTypes | null;
  enrolments: EnrolmentsTypes;
  pastEvents: PastEventsTypes | null;
}

const ProfileEventsList: FunctionComponent<ProfileEventsListProps> = ({
  availableEvents,
  enrolments,
  pastEvents,
}) => {
  const history = useHistory();
  const { t } = useTranslation();

  const gotoEventPage = (eventId: string) => {
    history.push(`/event/${eventId}`);
  };

  const formatOccurrenceTime = (
    startTimeRaw: Date,
    durationMinutes: number | null
  ) => {
    let occurrenceTime;
    const startTime = formatTime(newMoment(startTimeRaw), DEFAULT_TIME_FORMAT);

    if (durationMinutes) {
      const endTimeRaw = newMoment(startTimeRaw).add(
        durationMinutes,
        'minutes'
      );
      const endTime = formatTime(newMoment(endTimeRaw), DEFAULT_TIME_FORMAT);
      occurrenceTime = `${startTime} - ${endTime}`;
    } else {
      occurrenceTime = startTime;
    }

    return occurrenceTime;
  };

  const generateInfoRow = (occurrence: OccurrenceTypes) => {
    return (
      <div className={styles.row}>
        <div className={styles.label}>
          <Icon
            src={calendarIcon}
            alt={t('TODO: action')}
            className={styles.labelIcon}
          />
          <div>
            {formatTime(newMoment(occurrence.time), DEFAULT_DATE_FORMAT)}
          </div>
        </div>
        <div className={styles.label}>
          <Icon
            src={clockIcon}
            alt={t('TODO: action')}
            className={styles.labelIcon}
          />
          <div>
            {formatOccurrenceTime(occurrence.time, occurrence.event.duration)}
          </div>
        </div>
        <div className={styles.label}>
          <Icon
            src={locationIcon}
            alt={t('TODO: action')}
            className={styles.labelIcon}
          />
          <div>{occurrence.venue.name}</div>
        </div>
      </div>
    );
  };

  return (
    <>
      {availableEvents?.edges?.[0] && (
        <>
          <h2>{t('profile.events.invitations.heading')}</h2>
          {availableEvents.edges.map(
            eventEdge =>
              eventEdge?.node && (
                <Card
                  key={eventEdge.node.id}
                  image={eventEdge.node.image}
                  title={eventEdge.node.name || ''} // TODO
                  action={() => gotoEventPage(eventEdge.node?.id || '')} // TODO
                  actionText={t('enrollment.enroll.buttonText')}
                  primaryAction={() => gotoEventPage(eventEdge.node?.id || '')} // TODO
                  primaryActionText={t('enrollment.enroll.buttonText')}
                >
                  <p>{eventEdge.node.shortDescription}</p>
                </Card>
              )
          )}
        </>
      )}
      {enrolments.edges?.[0] && (
        <>
          <h2>{t('profile.events.upcoming.heading')}</h2>
          {enrolments.edges.map(
            enrolmentEdge =>
              enrolmentEdge?.node?.occurrence && (
                <Card
                  className={styles.enrolment}
                  key={enrolmentEdge.node.occurrence.event.id}
                  image={enrolmentEdge.node.occurrence.event.image}
                  title={enrolmentEdge.node.occurrence.event.name || ''}
                  extraElement={
                    <QRCode value={'Hello World - this works'} ecLevel={'H'} />
                  }
                  action={() =>
                    gotoEventPage(enrolmentEdge.node?.occurrence.event.id || '')
                  }
                  actionText={t('enrollment.showEventInfo.buttonText')}
                  focalContent={generateInfoRow(enrolmentEdge.node.occurrence)}
                >
                  <p>{enrolmentEdge.node.occurrence.event.shortDescription}</p>
                </Card>
              )
          )}
        </>
      )}
      {pastEvents?.edges?.[0] && (
        <>
          <h2>{t('profile.events.past.heading')}</h2>
          {pastEvents.edges.map(
            pastEventEdge =>
              pastEventEdge?.node && (
                <Card
                  key={pastEventEdge.node.id}
                  image={pastEventEdge.node.image}
                  title={pastEventEdge.node.name || ''}
                  action={() => gotoEventPage(pastEventEdge.node?.id || '')}
                  actionText={t('enrollment.showEventInfo.buttonText')}
                >
                  <p>{pastEventEdge.node.shortDescription}</p>
                </Card>
              )
          )}
        </>
      )}
    </>
  );
};

export default ProfileEventsList;
