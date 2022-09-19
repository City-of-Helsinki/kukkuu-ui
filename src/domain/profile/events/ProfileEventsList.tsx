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

function switchEventOrEventGroup<R>(
  model: UpcomingEventsAndEventGroupsNode,
  isEvent: (event: EventNode) => R,
  isEventGroup: (eventGroup: EventGroupNode) => R
) {
  const typeHandlers: Record<
    UpcomingEventsAndEventGroupsNode['__typename'],
    () => R
  > = {
    EventGroupNode: () => isEventGroup(model as EventGroupNode),
    EventNode: () => isEvent(model as EventNode),
  };
  return typeHandlers[model['__typename']]();
}

function switchInternalOrTicketSystemEnrolment<R>(
  enrolmentNode: InternalOrTicketSystemEnrolmentNode,
  isInternal: (internalEnrolment: EnrolmentNode) => R,
  isTicketmaster: (ticketmasterEnrolment: TicketmasterEnrolmentNode) => R
) {
  const typeHandlers: Record<
    InternalOrTicketSystemEnrolmentNode['__typename'],
    () => R
  > = {
    EnrolmentNode: () => isInternal(enrolmentNode as EnrolmentNode),
    TicketmasterEnrolmentNode: () =>
      isTicketmaster(enrolmentNode as TicketmasterEnrolmentNode),
  };
  return typeHandlers[enrolmentNode['__typename']]();
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

  const gotoExternalEnrolmentEventPage = (eventId: string) => {
    history.push(
      getPathname(
        `/profile/child/${childId}/event/${eventId}/external-enrolment`
      )
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

  const enrolmentsListItems: JSX.Element | null = enrolments.length ? (
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
                  gotoExternalEnrolmentEventPage(ticketmasterEnrolment.event.id)
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
  ) : null;

  const upcomingEventsAndEventGroupsListItems: JSX.Element | null =
    upcomingEventsAndEventGroups.length ? (
      <React.Fragment key="upcomingEventsAndEventGroups">
        <Text variant="h2">{t('profile.events.invitations.heading')}</Text>
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
                  (event) => (event.canChildEnroll ? 'visible' : 'hidden'),
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
                  () => t('profile.child.detail.availableEvent.readMoreButton'),
                  () =>
                    t('profile.child.detail.availableEventGroup.readMoreButton')
                )}
              />
            );
          })}
        />
      </React.Fragment>
    ) : null;

  const pastEventsListItems: JSX.Element | null = pastEvents.length ? (
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
  ) : null;

  return (
    <List
      variant="spacing-xl"
      items={[
        enrolmentsListItems,
        upcomingEventsAndEventGroupsListItems,
        pastEventsListItems,
      ]}
    />
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
