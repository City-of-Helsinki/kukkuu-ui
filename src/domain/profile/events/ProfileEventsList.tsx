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
import List from '../../../common/components/list/List';
import OccurrenceInfo from '../../event/partial/OccurrenceInfo';
import EventCard from '../../event/eventCard/EventCard';
import Config from '../../config';
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
      <List
        variant="spacing-xl"
        items={[
          availableEventsAndEventGroups.length > 0 && (
            <React.Fragment key="availableEventsAndEventGroups">
              <Text variant="h2">
                {t('profile.events.invitations.heading')}
              </Text>
              <List
                variant="spacing-layout-2-xs"
                items={availableEventsAndEventGroups.map(
                  (eventOrEventGroup) => (
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
                        () =>
                          t(
                            'profile.child.detail.availableEvent.readMoreButton'
                          ),
                        () =>
                          t(
                            'profile.child.detail.availableEventGroup.readMoreButton'
                          )
                      )}
                    />
                  )
                )}
              />
            </React.Fragment>
          ),
          occurrences.length > 0 && (
            <React.Fragment key="occurrences">
              <Text variant="h2">{t('profile.events.upcoming.heading')}</Text>
              <List
                variant="spacing-layout-2-xs"
                items={occurrences.map((occurrence) => (
                  <EventCard
                    key={occurrence.event.id}
                    imageElement={
                      <div className={styles.qrWrapper}>
                        <QRCode
                          quietZone={0}
                          size={QR_CODE_SIZE_PX}
                          value={getTicketValidationUrl(
                            occurrence?.enrolments?.edges?.[0]?.node
                              ?.referenceId
                          )}
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
              />
            </React.Fragment>
          ),
          pastEvents.length > 0 && (
            <React.Fragment key="pastEvents">
              <Text variant="h2">{t('profile.events.past.heading')}</Text>
              <List
                variant="spacing-layout-2-xs"
                items={pastEvents.map((pastEvent) => (
                  <EventCard
                    key={pastEvent.id}
                    event={pastEvent}
                    action={() => gotoEventPage(pastEvent.id, true)}
                    actionText={t('enrollment.showEventInfo.buttonText')}
                    primaryAction="hidden"
                  />
                ))}
              />
            </React.Fragment>
          ),
        ]}
      />
    </>
  );
};

const getTicketValidationUrl = (referenceId?: string | null) =>
  referenceId ? `${Config.adminUrl}/${referenceId}` : undefined;

export default ProfileEventsList;
