import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { QRCode } from 'react-qrcode-logo';

import RelayList from '../../api/relayList';
import Text from '../../../common/components/text/Text';
import List from '../../../common/components/list/List';
import useGetPathname from '../../../common/route/utils/useGetPathname';
import OccurrenceInfo from '../../event/partial/OccurrenceInfo';
import EventCard from '../../event/eventCard/EventCard';
import Config from '../../config';
import styles from './profileEventsList.module.scss';
import useChildEnrolmentCount from '../../child/useChildEnrolmentCount';
import {
  PastEvents,
  PastEvent,
  InternalAndTicketSystemEnrolments,
  InternalOrTicketSystemEnrolment,
  InternalEnrolment,
  TicketmasterEnrolment,
  LippupisteEnrolment,
  UpcomingEventsAndEventGroups,
  UpcomingEventOrEventGroup,
  UpcomingEvent,
  UpcomingEventGroup,
  TixlyEnrolment,
} from '../../child/types/ChildByIdQueryTypes';

const upcomingEventsAndEventGroupsList = RelayList<UpcomingEventOrEventGroup>();
const pastEventsList = RelayList<PastEvent>();
const enrolmentsList = RelayList<InternalOrTicketSystemEnrolment>();

function switchEventOrEventGroup<R>(
  model: UpcomingEventOrEventGroup,
  isEvent: (event: UpcomingEvent) => R,
  isEventGroup: (eventGroup: UpcomingEventGroup) => R
) {
  const typeHandlers: Record<UpcomingEventOrEventGroup['__typename'], () => R> =
    {
      EventGroupNode: () => isEventGroup(model as UpcomingEventGroup),
      EventNode: () => isEvent(model as UpcomingEvent),
    };
  return typeHandlers[model['__typename']]();
}

function switchInternalOrTicketSystemEnrolment<R>(
  enrolmentNode: InternalOrTicketSystemEnrolment,
  isInternal: (internalEnrolment: InternalEnrolment) => R,
  isTicketmaster: (ticketmasterEnrolment: TicketmasterEnrolment) => R,
  isLippupiste: (lippupisteEnrolment: LippupisteEnrolment) => R,
  isTixly: (tixlyEnrolment: TixlyEnrolment) => R
) {
  const typeHandlers: Record<
    InternalOrTicketSystemEnrolment['__typename'],
    () => R
  > = {
    EnrolmentNode: () => isInternal(enrolmentNode as InternalEnrolment),
    TicketmasterEnrolmentNode: () =>
      isTicketmaster(enrolmentNode as TicketmasterEnrolment),
    LippupisteEnrolmentNode: () =>
      isLippupiste(enrolmentNode as LippupisteEnrolment),
    TixlyEnrolmentNode: () => isTixly(enrolmentNode as TixlyEnrolment),
  };
  return typeHandlers[enrolmentNode['__typename']]();
}

type Props = {
  upcomingEventsAndEventGroups: UpcomingEventsAndEventGroups | null;
  childId: string;
  pastEvents: PastEvents | null;
  enrolments: InternalAndTicketSystemEnrolments | null;
};

const QR_CODE_SIZE_PX = 300;

const ProfileEventsList = ({
  upcomingEventsAndEventGroups: upcomingEventsAndEventGroupsData,
  childId,
  pastEvents: pastEventsData,
  enrolments: enrolmentsData,
}: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data } = useChildEnrolmentCount({
    variables: {
      childId: childId,
    },
  });
  const getPathname = useGetPathname();

  const gotoEventPage = (eventId: string, past = false) => {
    const pastUrl = past ? '/past' : '';
    navigate(
      getPathname(`/profile/child/${childId}/event/${eventId}${pastUrl}`)
    );
  };

  const gotoEventGroupPage = (eventGroupId: string) => {
    navigate(
      getPathname(`/profile/child/${childId}/event-group/${eventGroupId}`)
    );
  };

  const gotoOccurrencePage = (occurrenceId: string) => {
    navigate(
      getPathname(`/profile/child/${childId}/occurrence/${occurrenceId}`)
    );
  };

  const gotoExternalEnrolmentEventPage = (eventId: string) => {
    navigate(
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

  const getInternalEnrolmentEventCard = (
    internalEnrolment: InternalEnrolment
  ) => (
    <EventCard
      key={internalEnrolment.id}
      imageElement={
        <div className={styles.qrWrapper}>
          <QRCode
            quietZone={0}
            size={QR_CODE_SIZE_PX}
            value={getTicketValidationUrl(internalEnrolment?.referenceId)}
            ecLevel={'H'}
          />
        </div>
      }
      event={internalEnrolment.occurrence.event}
      action={() => gotoOccurrencePage(internalEnrolment.occurrence.id)}
      actionText={t('enrollment.showEventInfo.buttonText')}
      primaryAction="hidden"
      focalContent={OccurrenceInfo({
        occurrence: internalEnrolment.occurrence,
        show: ['time', 'duration', 'venue'],
      })}
    />
  );

  const getExternalEnrolmentEventCard = (
    externalTicketSystemEnrolment:
      | TicketmasterEnrolment
      | LippupisteEnrolment
      | TixlyEnrolment
  ) => (
    <EventCard
      key={externalTicketSystemEnrolment.id}
      event={externalTicketSystemEnrolment.event}
      action={() =>
        gotoExternalEnrolmentEventPage(externalTicketSystemEnrolment.event.id)
      }
      actionText={t('enrollment.showEventInfo.buttonText')}
      primaryAction="hidden"
    />
  );

  const enrolmentsListItems: JSX.Element | null = enrolments.length ? (
    <React.Fragment key="enrolments">
      <Text variant="h2">{t('profile.events.enrolled.heading')}</Text>
      <List
        variant="spacing-layout-2-xs"
        items={enrolments.map((internalOrTicketSystemEnrolment) =>
          switchInternalOrTicketSystemEnrolment(
            internalOrTicketSystemEnrolment,
            getInternalEnrolmentEventCard,
            getExternalEnrolmentEventCard,
            getExternalEnrolmentEventCard,
            getExternalEnrolmentEventCard
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
  eventOrEventGroup: UpcomingEventOrEventGroup,
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
