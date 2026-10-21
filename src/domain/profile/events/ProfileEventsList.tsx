import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
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
import { EnrolmentDeniedReason } from '../../api/generatedTypes/graphql';
import {
  getEarliestRegistrationOpensAt,
  getRegistrationNotOpenNotice,
  type RegistrationOpens,
} from '../../event/EventUtils';
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

  const enrolmentsListItems: React.ReactElement | null = enrolments.length ? (
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

  const upcomingEventsAndEventGroupsListItems: React.ReactElement | null =
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
                      {t(focalContent.key, {
                        count: enrolmentCount ?? 0,
                        ...focalContent.values,
                      })}
                    </>
                  ) : undefined
                }
                key={eventOrEventGroup.id}
                event={eventOrEventGroup}
                primaryAction={switchEventOrEventGroup(
                  eventOrEventGroup,
                  (event) => {
                    const canChildEnroll = event.enrolmentDeniedReason === null;
                    return canChildEnroll ? 'visible' : 'hidden';
                  },
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

  const pastEventsListItems: React.ReactElement | null = pastEvents.length ? (
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

type FocalContent = {
  key: string;
  values?: RegistrationOpens;
};

/**
 * Get the focal content for an event card the child cannot enrol in.
 * When registration has not opened yet, the content tells when it opens,
 * or says generically that it has not opened if the opening time is missing
 * or already past. Any other reason gets the generic "cannot enrol" text.
 *
 * @param event - An upcoming event the child cannot enrol in.
 * @returns The translation key and, for the opening time text, its values.
 */
const getNoEnrolEventFocalContent = (event: UpcomingEvent): FocalContent => {
  if (
    event.enrolmentDeniedReason !== EnrolmentDeniedReason.RegistrationNotOpen
  ) {
    return { key: 'profileEventList.message.noEnrollEvent' };
  }
  return getRegistrationNotOpenNotice(event.registrationOpensAt);
};

/**
 * Get the focal content for an event group card the child cannot enrol in.
 * When registration has not opened yet, the content tells when the first
 * event of the group opens, or says generically that it has not opened if
 * no opening time is known or it is already past. Any other reason gets the
 * generic "cannot enrol" text.
 *
 * @param eventGroup - An upcoming event group the child cannot enrol in.
 * @returns The translation key and, when registration opens in the future,
 * the earliest opening `date` and `time` to fill into it.
 */
const getNoEnrolEventGroupFocalContent = (
  eventGroup: UpcomingEventGroup
): FocalContent => {
  if (
    eventGroup.enrolmentDeniedReason !==
    EnrolmentDeniedReason.RegistrationNotOpen
  ) {
    return { key: 'profileEventList.message.noEnrollEventGroup' };
  }
  return getRegistrationNotOpenNotice(
    getEarliestRegistrationOpensAt(
      eventGroup.events.edges.map((edge) => edge?.node)
    )
  );
};

const getFocalContent = (
  eventOrEventGroup: UpcomingEventOrEventGroup,
  childDoesNotHaveEnrolmentsLeft: boolean
): FocalContent | null => {
  if (childDoesNotHaveEnrolmentsLeft) {
    return {
      key: switchEventOrEventGroup(
        eventOrEventGroup,
        () => 'profileEventList.message.alreadyEnrolledEvent',
        () => 'profileEventList.message.alreadyEnrolledEventGroup'
      ),
    };
  }

  return switchEventOrEventGroup<FocalContent | null>(
    eventOrEventGroup,
    (event) => {
      const canChildEnroll = event.enrolmentDeniedReason === null;
      return !canChildEnroll ? getNoEnrolEventFocalContent(event) : null;
    },
    (eventGroup) => {
      const canChildEnroll = eventGroup.enrolmentDeniedReason === null;
      return !canChildEnroll
        ? getNoEnrolEventGroupFocalContent(eventGroup)
        : null;
    }
  );
};

export default ProfileEventsList;
