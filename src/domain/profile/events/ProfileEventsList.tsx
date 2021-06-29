import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { QRCode } from 'react-qrcode-logo';

import {
  childByIdQuery_child_availableEventsAndEventGroups as AvailableEventsAndEventGroups,
  childByIdQuery_child_availableEventsAndEventGroups_edges_node as AvailableEventOrEventGroupNode,
  childByIdQuery_child_availableEventsAndEventGroups_edges_node_EventNode as EventNode,
  childByIdQuery_child_availableEventsAndEventGroups_edges_node_EventGroupNode as EventGroupNode,
  childByIdQuery_child_pastEvents as PastEventsTypes,
  childByIdQuery_child_pastEvents_edges_node as PastEventNode,
  childByIdQuery_child_occurrences as Occurrences,
  childByIdQuery_child_occurrences_edges_node as OccurrenceNode,
} from '../../api/generatedTypes/childByIdQuery';
import RelayList from '../../api/relayList';
import Text from '../../../common/components/text/Text';
import OccurrenceInfo from '../../event/partial/OccurrenceInfo';
import EventCard from '../../event/eventCard/EventCard';
import styles from './profileEventsList.module.scss';

const availableEventsAndEventGroupsList =
  RelayList<AvailableEventOrEventGroupNode>();
const occurrencesList = RelayList<OccurrenceNode>();
const pastEventsList = RelayList<PastEventNode>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function when<R = any>(
  model: AvailableEventOrEventGroupNode,
  isEvent: (event: EventNode) => R,
  isEventGroup: (eventGroup: EventGroupNode) => R
) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const isEventGroupType = model['__typename'] === 'EventGroupNode';

  if (isEventGroupType) {
    const eventGroup = model as EventGroupNode;

    return isEventGroup(eventGroup);
  }

  const event = model as EventNode;

  return isEvent(event);
}

type Props = {
  availableEventsAndEventGroups: AvailableEventsAndEventGroups | null;
  childId: string;
  pastEvents: PastEventsTypes | null;
  occurrences: Occurrences | null;
};

const QR_CODE_SIZE_PX = 300;

const ProfileEventsList = ({
  availableEventsAndEventGroups: availableEventsAndEventGroupsData,
  childId,
  occurrences: occurrenceData,
  pastEvents: pastEventsData,
}: Props) => {
  const history = useHistory();
  const { t } = useTranslation();

  const gotoEventPage = (eventId: string, past = false) => {
    const pastUrl = past ? '/past' : '';
    history.push(`/profile/child/${childId}/event/${eventId}${pastUrl}`);
  };

  const gotoEventGroupPage = (eventGroupId: string) => {
    history.push(`/profile/child/${childId}/event-group/${eventGroupId}`);
  };

  const gotoOccurrencePage = (occurrenceId: string) => {
    history.push(`/profile/child/${childId}/occurrence/${occurrenceId}`);
  };

  const availableEventsAndEventGroups = availableEventsAndEventGroupsList(
    availableEventsAndEventGroupsData
  ).items;
  const occurrences = occurrencesList(occurrenceData).items;
  const pastEvents = pastEventsList(pastEventsData).items;

  return (
    <>
      {availableEventsAndEventGroups.length > 0 && (
        <div className={styles.eventsList}>
          <h2>{t('profile.events.invitations.heading')}</h2>
          {availableEventsAndEventGroups.map((eventOrEventGroup) => (
            <EventCard
              key={eventOrEventGroup.id}
              event={eventOrEventGroup}
              action={() =>
                when(
                  eventOrEventGroup,
                  () => gotoEventPage(eventOrEventGroup.id),
                  () => gotoEventGroupPage(eventOrEventGroup.id)
                )
              }
              actionText={when<string>(
                eventOrEventGroup,
                () => t('profile.child.detail.availableEvent.readMoreButton'),
                () =>
                  t('profile.child.detail.availableEventGroup.readMoreButton')
              )}
            />
          ))}
        </div>
      )}
      {occurrences.length > 0 && (
        <div className={styles.eventsList}>
          <h2>{t('profile.events.upcoming.heading')}</h2>
          {occurrences.map((occurrence) => (
            <EventCard
              key={occurrence.event.id}
              imageElement={
                <div className={styles.qrWrapper}>
                  <QRCode
                    quietZone={0}
                    size={QR_CODE_SIZE_PX}
                    value={occurrence.event.name || ''}
                    ecLevel={'H'}
                  />
                </div>
              }
              event={occurrence.event}
              action={() => gotoOccurrencePage(occurrence.id)}
              actionText={t('enrollment.showEventInfo.buttonText')}
              primaryAction="hidden"
              focalContent={OccurrenceInfo({
                occurrence,
                show: ['time', 'duration', 'venue'],
              })}
            />
          ))}
        </div>
      )}
      {pastEvents.length > 0 && (
        <div className={styles.eventsList}>
          <h2>{t('profile.events.past.heading')}</h2>
          <Text variant="body-l" className={styles.descriptionMaxWidth}>
            {t('profile.events.past.ticketmasterNotice')}
          </Text>
          {pastEvents.map((pastEvent) => (
            <EventCard
              key={pastEvent.id}
              event={pastEvent}
              action={() => gotoEventPage(pastEvent.id, true)}
              actionText={t('enrollment.showEventInfo.buttonText')}
              primaryAction="hidden"
            />
          ))}
        </div>
      )}
    </>
  );
};

export default ProfileEventsList;
