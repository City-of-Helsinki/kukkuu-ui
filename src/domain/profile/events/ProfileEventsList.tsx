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
} from '../../api/generatedTypes/childByIdQuery';
import styles from './profileEventsList.module.scss';

import nullIcon from '../../../assets/icons/svg/close.svg';
import Icon from '../../../common/components/icon/Icon';

interface ProfileEventsListProps {
  availableEvents?: AvailableEventsTypes;
  enrolments?: EnrolmentsTypes;
  pastEvents?: PastEventsTypes;
}

const ProfileEventsList: FunctionComponent<ProfileEventsListProps> = ({
  availableEvents,
  enrolments,
  pastEvents,
}) => {
  const history = useHistory();
  const { t } = useTranslation();

  const generatePath = (eventId: string) => {
    // http://localhost:3000/fi/event/RXZlbnROb2RlOjE=
    history.push(`/fi/event/${eventId}`); // TODO
  };

  // TODO: normalize?

  return (
    <>
      {availableEvents && (
        <>
          <h2>{t('TODO: event invites')}</h2> {/* TODO */}
          {availableEvents.edges.map(
            eventEdge =>
              eventEdge?.node && (
                <div key={eventEdge.node.id}>
                  <Card
                    // TODO: action = ../event/:id?
                    image={eventEdge.node.image}
                    title={eventEdge.node.translations[0].name} // TODO
                    action={'action'} // TODO
                    actionText={t('TODO: go to event details')}
                    primaryAction={() => generatePath(eventEdge.node?.id || '')} // TODO
                    primaryActionText={t('TODO: tickets')} // TODO
                  >
                    {/* TODO */}
                    <p>{eventEdge.node.translations[0].shortDescription}</p>
                  </Card>
                </div>
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
                <div key={enrolmentEdge.node.occurrence.event.id}>
                  <Card
                    image={enrolmentEdge.node.occurrence.event.image}
                    title={
                      enrolmentEdge.node.occurrence.event.translations[0].name
                    }
                    action={'action'}
                    actionText={t('TODO: go to event details')}
                  >
                    <p>
                      {
                        enrolmentEdge.node.occurrence.event.translations[0]
                          .shortDescription
                      }
                    </p>
                    <div className={styles.row}>
                      <div className={styles.label}>
                        <Icon
                          src={nullIcon}
                          alt={t('TODO: action')}
                          className={styles.goto}
                        />
                        <div>
                          {formatTime(
                            newMoment(enrolmentEdge.node.occurrence.time),
                            DEFAULT_DATE_FORMAT
                          )}
                        </div>
                      </div>
                      <div className={styles.label}>
                        <Icon
                          src={nullIcon}
                          alt={t('TODO: action')}
                          className={styles.goto}
                        />
                        <div>
                          {formatTime(
                            newMoment(enrolmentEdge.node.occurrence.time),
                            'HH.MM' // TODO
                          )}
                        </div>
                      </div>
                      <div className={styles.label}>
                        <Icon
                          src={nullIcon}
                          alt={t('TODO: action')}
                          className={styles.goto}
                        />
                        <div>{enrolmentEdge.node.occurrence.venue.name}</div>
                      </div>
                    </div>
                  </Card>
                </div>
              )
          )}
        </>
      )}
      {pastEvents && (
        <>
          <h2>{t('TODO: past events')}</h2>
          {pastEvents.edges.map(
            pastEventEdge =>
              pastEventEdge?.node && (
                <div key={pastEventEdge.node.id}>
                  <Card
                    image={pastEventEdge.node.image}
                    title={pastEventEdge.node.translations[0].name}
                    action={'action'}
                    actionText={t('TODO: go to event details')}
                  >
                    <p>{pastEventEdge.node.translations[0].shortDescription}</p>
                  </Card>
                </div>
              )
          )}
        </>
      )}
    </>
  );
};

export default ProfileEventsList;
