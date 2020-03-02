import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import Card from '../../../common/components/card/Card';
import { DEFAULT_DATE_FORMAT } from '../../../common/time/TimeConstants';
import { formatTime, newMoment } from '../../../common/time/utils';
import {
  childByIdQuery_child_availableEvents as AvailableEventsTypes,
  childByIdQuery_child_enrolments as EnrolmentsTypes,
  childByIdQuery_child_pastEvents as PastEventsTypes,
  childByIdQuery_child_enrolments_edges_node_occurrence as OccurrenceTypes,
} from '../../api/generatedTypes/childByIdQuery';
import styles from './profileEventsList.module.scss';
import clockIcon from '../../../assets/icons/svg/clock.svg';
import nullIcon from '../../../assets/icons/svg/close.svg';
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

  const generateInfoRow = (occurrence: OccurrenceTypes) => {
    return (
      <div className={styles.row}>
        <div className={styles.label}>
          <Icon
            src={nullIcon}
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
            {formatTime(
              newMoment(occurrence.time),
              'HH.MM' // TODO
            )}
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
      {availableEvents && ( // TODO: empty check
        <>
          <h2>{t('TODO: event invites')}</h2> {/* TODO */}
          {availableEvents.edges.map(
            eventEdge =>
              eventEdge?.node && (
                <Card
                  key={eventEdge.node.id}
                  image={eventEdge.node.image}
                  title={eventEdge.node.name || ''} // TODO
                  action={() => gotoEventPage(eventEdge.node?.id || '')} // TODO
                  actionText={t('TODO: go to event details')} // TODO
                  primaryAction={() => gotoEventPage(eventEdge.node?.id || '')} // TODO
                  primaryActionText={t('TODO: tickets')} // TODO
                >
                  {/* TODO */}
                  <p>{eventEdge.node.shortDescription}</p>
                </Card>
              )
          )}
        </>
      )}
      {enrolments && (
        <>
          <h2>{t('TODO: upcoming events')}</h2>
          {enrolments.edges.map(
            enrolmentEdge =>
              enrolmentEdge?.node?.occurrence && (
                <Card
                  key={enrolmentEdge.node.occurrence.event.id}
                  image={enrolmentEdge.node.occurrence.event.image}
                  title={enrolmentEdge.node.occurrence.event.name || ''}
                  action={() =>
                    gotoEventPage(enrolmentEdge.node?.occurrence.event.id || '')
                  }
                  actionText={t('TODO: go to event details')}
                  focalContent={generateInfoRow(enrolmentEdge.node.occurrence)}
                >
                  <p>{enrolmentEdge.node.occurrence.event.shortDescription}</p>
                </Card>
              )
          )}
        </>
      )}
      {pastEvents && ( // TODO: empty check
        <>
          <h2>{t('TODO: past events')}</h2>
          {pastEvents.edges.map(
            pastEventEdge =>
              pastEventEdge?.node && (
                <Card
                  key={pastEventEdge.node.id}
                  image={pastEventEdge.node.image}
                  title={pastEventEdge.node.name || ''}
                  action={() => gotoEventPage(pastEventEdge.node?.id || '')}
                  actionText={t('TODO: go to event details')}
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
