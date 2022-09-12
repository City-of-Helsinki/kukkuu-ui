import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { QRCode } from 'react-qrcode-logo';

import {
  childByIdQuery_child_upcomingEventsAndEventGroups as UpcomingEventsAndEventGroups,
  childByIdQuery_child_upcomingEventsAndEventGroups_edges_node as UpcomingEventsAndEventGroupsNode,
  childByIdQuery_child_upcomingEventsAndEventGroups_edges_node_EventNode as EventNode,
  childByIdQuery_child_upcomingEventsAndEventGroups_edges_node_EventGroupNode as EventGroupNode,
  childByIdQuery_child_pastEvents as PastEventsTypes,
  childByIdQuery_child_pastEvents_edges_node as PastEventNode,
  childByIdQuery_child_activeInternalAndTicketSystemEnrolments as InternalAndTicketSystemEnrolments,
  childByIdQuery_child_activeInternalAndTicketSystemEnrolments_edges_node as InternalOrTicketSystemEnrolmentNode,
  childByIdQuery_child_activeInternalAndTicketSystemEnrolments_edges_node_EnrolmentNode as EnrolmentNode,
  // eslint-disable-next-line max-len
  childByIdQuery_child_activeInternalAndTicketSystemEnrolments_edges_node_TicketmasterEnrolmentNode as TicketmasterEnrolmentNode,
} from '../../api/generatedTypes/childByIdQuery';
import RelayList from '../../api/relayList';
import Text from '../../../common/components/text/Text';
import List from '../../../common/components/list/List';
import useGetPathname from '../../../common/route/utils/useGetPathname';
import OccurrenceInfo from '../../event/partial/OccurrenceInfo';
import EventCard from '../../event/eventCard/EventCard';
import Config from '../../config';
import styles from './profileEventsList.module.scss';
import useChildEnrolmentCount from '../../child/useChildEnrolmentCount';
import TicketMasterInfo from '../../event/partial/TicketMasterInfo';

const upcomingEventsAndEventGroupsList =
  RelayList<UpcomingEventsAndEventGroupsNode>();
const pastEventsList = RelayList<PastEventNode>();
const enrolmentsList = RelayList<InternalOrTicketSystemEnrolmentNode>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function switchEventOrEventGroup<R = any>(
  model: UpcomingEventsAndEventGroupsNode,
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function switchInternalOrTicketSystemEnrolment<R = any>(
  model: InternalOrTicketSystemEnrolmentNode,
  isInternal: (internalEnrolment: EnrolmentNode) => R,
  isTicketmaster: (ticketmasterEnrolment: TicketmasterEnrolmentNode) => R
) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const isInternalType = model['__typename'] === 'EnrolmentNode';

  if (isInternalType) {
    const enrolment = model as EnrolmentNode;

    return isInternal(enrolment);
  }

  const ticketmasterEnrolment = model as TicketmasterEnrolmentNode;

  return isTicketmaster(ticketmasterEnrolment);
}

type Props = {
  upcomingEventsAndEventGroups: UpcomingEventsAndEventGroups | null;
  childId: string;
  pastEvents: PastEventsTypes | null;
  enrolments: InternalAndTicketSystemEnrolments | null;
};

const QR_CODE_SIZE_PX = 300;

const ProfileEventsList = ({
  upcomingEventsAndEventGroups: upcomingEventsAndEventGroupsData,
  childId,
  pastEvents: pastEventsData,
  enrolments: enrolmentsData,
}: Props) => {
  const history = useHistory();
  const { t } = useTranslation();
  const { data } = useChildEnrolmentCount({
    variables: {
      childId: childId,
    },
  });
  const getPathname = useGetPathname();

  const gotoEventPage = (eventId: string, past = false) => {
    const pastUrl = past ? '/past' : '';
    history.push(
      getPathname(`/profile/child/${childId}/event/${eventId}${pastUrl}`)
    );
  };

  const gotoEventGroupPage = (eventGroupId: string) => {
    history.push(
      getPathname(`/profile/child/${childId}/event-group/${eventGroupId}`)
    );
  };

  const gotoOccurrencePage = (occurrenceId: string) => {
    history.push(
      getPathname(`/profile/child/${childId}/occurrence/${occurrenceId}`)
    );
  };

  const upcomingEventsAndEventGroups = upcomingEventsAndEventGroupsList(
    upcomingEventsAndEventGroupsData
  ).items;
  const pastEvents = pastEventsList(pastEventsData).items;
  const enrolmentCount = data?.child?.enrolmentCount;
  const pastEnrolmentCount = data?.child?.pastEnrolmentCount;
  const enrolmentLimit = data?.child?.project?.enrolmentLimit;
  const childDoesNotHaveEnrolmentsLeft = Boolean(
    pastEnrolmentCount && enrolmentLimit && pastEnrolmentCount >= enrolmentLimit
  );
  const enrolments = enrolmentsList(enrolmentsData).items;
  return (
    <>
      <List
        variant="spacing-xl"
        items={[
          enrolments.length > 0 && (
            <React.Fragment key="enrolments">
              <Text variant="h2">{t('profile.events.enrolled.heading')}</Text>
              <List
                variant="spacing-layout-2-xs"
                items={enrolments.map((internalOrTicketSystemEnrolment) =>
                  switchInternalOrTicketSystemEnrolment(
                    internalOrTicketSystemEnrolment,
                    (internalEnrolment) => (
                      <EventCard
                        key={internalEnrolment.id}
                        imageElement={
                          <div className={styles.qrWrapper}>
                            <QRCode
                              quietZone={0}
                              size={QR_CODE_SIZE_PX}
                              value={getTicketValidationUrl(
                                internalEnrolment?.referenceId
                              )}
                              ecLevel={'H'}
                            />
                          </div>
                        }
                        event={internalEnrolment.occurrence.event}
                        action={() =>
                          gotoOccurrencePage(internalEnrolment.occurrence.id)
                        }
                        actionText={t('enrollment.showEventInfo.buttonText')}
                        primaryAction="hidden"
                        focalContent={OccurrenceInfo({
                          occurrence: internalEnrolment.occurrence,
                          show: ['time', 'duration', 'venue'],
                        })}
                      />
                    ),
                    (ticketmasterEnrolment) => (
                      <EventCard
                        key={internalOrTicketSystemEnrolment.id}
                        event={ticketmasterEnrolment.event}
                        action={() =>
                          gotoEventPage(ticketmasterEnrolment.event.id)
                        }
                        actionText={t('enrollment.showEventInfo.buttonText')}
                        primaryAction="hidden"
                        focalContent={TicketMasterInfo()}
                      />
                    )
                  )
                )}
              />
            </React.Fragment>
          ),
          upcomingEventsAndEventGroups.length > 0 && (
            <React.Fragment key="upcomingEventsAndEventGroups">
              <Text variant="h2">
                {t('profile.events.invitations.heading')}
              </Text>
              <List
                variant="spacing-layout-2-xs"
                items={upcomingEventsAndEventGroups.map((eventOrEventGroup) => {
                  const focalContent = getFocalContent(
                    eventOrEventGroup,
                    childDoesNotHaveEnrolmentsLeft
                  );

                  return (
                    <EventCard
                      focalContent={
                        focalContent ? (
                          <>
                            {t(focalContent, {
                              count: enrolmentCount ?? 0,
                            })}
                          </>
                        ) : undefined
                      }
                      key={eventOrEventGroup.id}
                      event={eventOrEventGroup}
                      primaryAction={switchEventOrEventGroup(
                        eventOrEventGroup,
                        (event) =>
                          event.canChildEnroll ? 'visible' : 'hidden',
                        () => 'visible'
                      )}
                      action={() =>
                        switchEventOrEventGroup(
                          eventOrEventGroup,
                          () => gotoEventPage(eventOrEventGroup.id),
                          () => gotoEventGroupPage(eventOrEventGroup.id)
                        )
                      }
                      actionText={switchEventOrEventGroup<string>(
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
                  );
                })}
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

const getFocalContent = (
  eventOrEventGroup: UpcomingEventsAndEventGroupsNode,
  childDoesNotHaveEnrolmentsLeft: boolean
) => {
  if (childDoesNotHaveEnrolmentsLeft) {
    return switchEventOrEventGroup(
      eventOrEventGroup,
      () => 'profileEventList.message.alreadyEnrolledEvent',
      () => 'profileEventList.message.alreadyEnrolledEventGroup'
    );
  }

  return switchEventOrEventGroup(
    eventOrEventGroup,
    (event) =>
      !event.canChildEnroll ? 'profileEventList.message.noEnrollEvent' : null,
    (eventGroup) =>
      !eventGroup.canChildEnroll
        ? 'profileEventList.message.noEnrollEventGroup'
        : null
  );
};

export default ProfileEventsList;
