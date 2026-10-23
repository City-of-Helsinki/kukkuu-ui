import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { useQuery, useMutation } from '@apollo/client';
import {
  Accordion,
  AccordionSize,
  IconCalendarEvent,
  IconPen,
  IconSearch,
  IconSize,
  Notification,
  NotificationSize,
} from 'hds-react';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/browser';

import Button from '../../../../common/components/button/Button';
import LinkButton from '../../../../common/components/button/LinkButton';
import Icon from '../../../../common/components/icon/Icon';
import { publicSvgIconPaths } from '../../../../public_files';
import useGetPathname from '../../../../common/route/utils/useGetPathname';
import { DEFAULT_DATE_FORMAT } from '../../../../common/time/TimeConstants';
import { formatTime, newDate } from '../../../../common/time/utils';
import { getCurrentLanguage } from '../../../../common/translation/TranslationUtils';
import { childByIdQuery } from '../../../child/queries/ChildQueries';
import {
  editChildMutation,
  deleteChildMutation,
} from '../../../child/mutation/ChildMutation';
import {
  ChildByIdQuery,
  UpdateChildMutationPayloadFieldsFragment,
  DeleteChildMutationPayloadFieldsFragment,
  ProfileQueryDocument,
} from '../../../api/generatedTypes/graphql';
import {
  EnrolmentEventGroup,
  UpcomingEventGroup,
  UpcomingEventGroupEvent,
} from '../../../child/types/ChildByIdQueryTypes';
import { MyProfileChild } from '../../types/ProfileQueryTypes';
import { useProfileContext } from '../../hooks/useProfileContext';
import ProfileChildDetailEditModal from './modal/ProfileChildDetailEditModal';
import ProfileChildSkeleton from '../skeleton/ProfileChildSkeleton';
import ProfileEnrolledEventCard from './ProfileEnrolledEventCard';
import type { ChildDetailEditModalPayload } from './types';
import graphqlClient from '../../../api/client';
import styles from './profileChildAccordionItem.module.scss';

export interface ProfileChildAccordionItemProps {
  child: MyProfileChild;
  initiallyOpen?: boolean;
}

const ProfileChildAccordionItem: React.FC<ProfileChildAccordionItemProps> = ({
  child,
  initiallyOpen = false,
}) => {
  const { t, i18n } = useTranslation();
  const getPathname = useGetPathname();
  const { refetchProfile } = useProfileContext();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data, loading: isChildLoading } = useQuery<ChildByIdQuery>(
    childByIdQuery,
    {
      variables: { id: child.id },
      skip: !child.id,
    }
  );

  const [editChild] = useMutation<UpdateChildMutationPayloadFieldsFragment>(
    editChildMutation,
    {
      refetchQueries: [
        { query: childByIdQuery, variables: { id: child.id } },
        { query: ProfileQueryDocument },
      ],
      onCompleted: () => {
        refetchProfile();
      },
    }
  );

  const [deleteChild] = useMutation<DeleteChildMutationPayloadFieldsFragment>(
    deleteChildMutation,
    {
      client: graphqlClient,
      refetchQueries: [{ query: ProfileQueryDocument }],
      onCompleted: () => {
        refetchProfile();
      },
    }
  );

  const [currentYear] = useState(() => new Date().getFullYear());
  const [currentTime] = useState(() => Date.now());
  const childAge = child.birthyear ? currentYear - child.birthyear : 0;
  const childName = child.name || t('profile.child.default.name.text');

  const childDetail = data?.child;
  const enrolledEvents =
    childDetail?.activeInternalAndTicketSystemEnrolments?.edges
      ?.map((edge) => edge?.node)
      ?.filter((node): node is NonNullable<typeof node> => Boolean(node)) || [];

  const isEnrolmentInFuture = (
    enrolment: typeof enrolledEvents[number]
  ) => {
    if (!enrolment) return false;
    if (enrolment.__typename === 'EnrolmentNode' && enrolment.occurrence?.time) {
      return new Date(enrolment.occurrence.time).getTime() >= currentTime;
    }
    return true;
  };

  const futureEnrolledEvents = enrolledEvents.filter(isEnrolmentInFuture);

  const getEnrolmentEvent = (
    enrolment: (typeof futureEnrolledEvents)[number]
  ) => {
    return enrolment.__typename === 'EnrolmentNode'
      ? enrolment.occurrence.event
      : enrolment.event;
  };

  const getEnrolmentEventGroup = (
    enrolment: (typeof futureEnrolledEvents)[number]
  ): EnrolmentEventGroup | null => {
    const ev = getEnrolmentEvent(enrolment) as {
      eventGroup?: EnrolmentEventGroup | null;
    };
    return ev?.eventGroup ?? null;
  };

  const upcomingNodes =
    childDetail?.upcomingEventsAndEventGroups?.edges
      ?.map((edge) => edge?.node)
      ?.filter((node): node is NonNullable<typeof node> => Boolean(node)) || [];

  const upcomingEventGroups = upcomingNodes.filter(
    (node): node is UpcomingEventGroup => node.__typename === 'EventGroupNode'
  );

  const allCandidateEventGroups: UpcomingEventGroup[] = [
    ...upcomingEventGroups,
  ];
  const seenEventGroupIds = new Set(upcomingEventGroups.map((eg) => eg.id));

  for (const enrolment of futureEnrolledEvents) {
    const evGroup = getEnrolmentEventGroup(enrolment);
    if (evGroup?.id && !seenEventGroupIds.has(evGroup.id)) {
      seenEventGroupIds.add(evGroup.id);
      allCandidateEventGroups.push({
        __typename: 'EventGroupNode',
        id: evGroup.id,
        name: evGroup.name ?? null,
        shortDescription: null,
        image: '',
        imageAltText: null,
        canChildEnroll: false,
        publishedAt: evGroup.publishedAt ?? null,
        events: { edges: [] },
      });
    }
  }

  const getPublishedGroupEvents = (
    eventGroup: UpcomingEventGroup
  ): UpcomingEventGroupEvent[] => {
    const rawEvents =
      eventGroup.events?.edges
        ?.map((edge) => edge?.node)
        ?.filter((node): node is UpcomingEventGroupEvent => Boolean(node)) ||
      [];
    return rawEvents.filter((ev) => Boolean(ev.publishedAt));
  };

  const getGroupEnrolments = (eventGroup: UpcomingEventGroup) => {
    const groupEventIds = new Set(
      (eventGroup.events?.edges || [])
        .map((edge) => edge?.node?.id)
        .filter((id): id is string => Boolean(id))
    );

    return futureEnrolledEvents.filter((enrolment) => {
      const ev = getEnrolmentEvent(enrolment);
      const evGroup = getEnrolmentEventGroup(enrolment);
      return evGroup?.id === eventGroup.id || groupEventIds.has(ev.id);
    });
  };

  const publishedEventGroupsWithEvents = allCandidateEventGroups.filter(
    (eventGroup) => {
      if (!eventGroup.publishedAt) return false;
      const publishedEvents = getPublishedGroupEvents(eventGroup);
      const groupEnrolments = getGroupEnrolments(eventGroup);
      return publishedEvents.length > 0 || groupEnrolments.length > 0;
    }
  );

  const enrolledIdsInGroups = new Set(
    publishedEventGroupsWithEvents.flatMap((eg) =>
      getGroupEnrolments(eg).map((enrolment) => enrolment.id)
    )
  );

  const standaloneFutureEnrolments = futureEnrolledEvents.filter(
    (enrolment) => !enrolledIdsInGroups.has(enrolment.id)
  );

  const pastEvents =
    childDetail?.pastEvents?.edges
      ?.map((edge) => edge?.node)
      ?.filter((node): node is NonNullable<typeof node> => Boolean(node)) || [];

  const getPastEventFormattedText = (
    pastEventId: string,
    pastEventName: string | null | undefined,
    occurrences?: { edges?: Array<{ node?: { time?: string | null } | null } | null> | null } | null
  ) => {
    const name = pastEventName || '';
    // 1. Check if child's profile enrolments has occurrence time for this event
    const enrolledOccTime = child.enrolments?.edges
      ?.map((edge) => edge?.node)
      ?.find((enrolment) => enrolment?.occurrence?.event?.id === pastEventId)
      ?.occurrence?.time;

    const occurrenceTime = enrolledOccTime || occurrences?.edges?.[0]?.node?.time;

    if (occurrenceTime) {
      try {
        const d = newDate(occurrenceTime);
        if (!Number.isNaN(d.getTime())) {
          return `${formatTime(d, DEFAULT_DATE_FORMAT)} ${name}`.trim();
        }
      } catch {
        // Fallback to name
      }
    }

    return name;
  };

  return (
    <Accordion
      card
      border
      heading={childName}
      headingLevel={3}
      initiallyOpen={initiallyOpen}
      closeButton={false}
      language={getCurrentLanguage(i18n) as 'fi' | 'sv' | 'en'}
      className={styles.accordion}
      id={`child-accordion-${child.id}`}
    >
      {isChildLoading && !childDetail ? (
        <ProfileChildSkeleton />
      ) : (
        <div className={styles.childCardContent}>
          {/* Left Column: Identity */}
          <div className={styles.leftColumn}>
            <Icon
              src={publicSvgIconPaths['childFaceHappy']}
              alt=""
              className={styles.avatar}
            />
            <h4 className={styles.childName}>{childName}</h4>
            <p className={styles.age}>
              {t('search.hero.childAge', { age: childAge })}
            </p>
            <p className={styles.themePath}>
              {t('profile.child.themePath', { themePath: '–' })}
            </p>
            <Button
              variant="supplementary"
              iconStart={<IconPen aria-hidden="true" />}
              className={styles.editButton}
              onClick={() => setIsEditModalOpen(true)}
              aria-haspopup="dialog"
              aria-label={t('profile.child.edit.ariaLabel', { name: childName })}
            >
              {t('profile.child.edit.buttonText')}
            </Button>
          </div>

          {/* Right Column: Events */}
          <div className={styles.rightColumn}>
            {/* Future Events */}
            <section
              className={styles.futureEventsSection}
              aria-labelledby={`future-events-heading-${child.id}`}
            >
              <h4
                id={`future-events-heading-${child.id}`}
                className={styles.sectionHeading}
              >
                {t('profile.events.future.heading')}
              </h4>

              {standaloneFutureEnrolments.length > 0 && (
                <div className={styles.enrolledList}>
                  {standaloneFutureEnrolments.map((enrolment) => (
                    <ProfileEnrolledEventCard
                      key={enrolment.id}
                      childId={child.id}
                      enrolment={enrolment}
                    />
                  ))}
                </div>
              )}

              {publishedEventGroupsWithEvents.map((eventGroup) => {
                const groupEnrolments = getGroupEnrolments(eventGroup);

                if (groupEnrolments.length > 0) {
                  return (
                    <div
                      key={eventGroup.id}
                      className={styles.searchPromptCard}
                      data-testid={`event-group-box-${eventGroup.id}`}
                    >
                      {eventGroup.name && (
                        <h5 className={styles.eventGroupHeading}>
                          {eventGroup.name}
                        </h5>
                      )}
                      <div className={styles.groupEnrolledList}>
                        {groupEnrolments.map((enrolment) => (
                          <ProfileEnrolledEventCard
                            key={enrolment.id}
                            childId={child.id}
                            enrolment={enrolment}
                          />
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={eventGroup.id}
                    className={styles.searchPromptCard}
                    data-testid={`event-group-box-${eventGroup.id}`}
                  >
                    {eventGroup.name && (
                      <h5 className={styles.eventGroupHeading}>
                        {eventGroup.name}
                      </h5>
                    )}
                    <div className={styles.searchPromptDashedBox}>
                      <div className={styles.searchPromptIcon} aria-hidden="true">
                        <IconCalendarEvent size={IconSize.Large} />
                      </div>
                      <p className={styles.searchPromptText}>
                        {t('profile.events.searchPrompt')}
                      </p>
                      <LinkButton
                        to={getPathname(`/profile/child/${child.id}/events`)}
                        variant="primary"
                        className={styles.searchButton}
                      >
                        <IconSearch aria-hidden="true" />
                        <span>{t('profile.events.searchButton')}</span>
                      </LinkButton>
                    </div>
                  </div>
                );
              })}

              {publishedEventGroupsWithEvents.length === 0 &&
                standaloneFutureEnrolments.length === 0 && (
                  <div className={styles.notStartedCard}>
                    <Notification
                      type="info"
                      size={NotificationSize.Small}
                      className={styles.notStartedNotification}
                    >
                      {t('profile.events.future.enrolmentNotStarted')}
                    </Notification>
                  </div>
                )}
            </section>

            {/* Past Events Accordion */}
            <Accordion
              heading={t('profile.events.past.heading')}
              headingLevel={4}
              size={AccordionSize.Small}
              closeButton={false}
              language={getCurrentLanguage(i18n) as 'fi' | 'sv' | 'en'}
              className={styles.pastEventsAccordion}
              id={`past-events-accordion-${child.id}`}
            >
              {pastEvents.length > 0 ? (
                <ul className={styles.pastEventsList}>
                  {pastEvents.map((pastEvent) => (
                    <li key={pastEvent.id} className={styles.pastEventItem}>
                      <Link
                        to={getPathname(
                          `/profile/child/${child.id}/event/${pastEvent.id}/past`
                        )}
                        className={styles.pastEventLink}
                      >
                        {getPastEventFormattedText(
                          pastEvent.id,
                          pastEvent.name,
                          pastEvent.occurrences
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.noPastEvents}>
                  {t('profile.events.past.empty')}
                </p>
              )}
            </Accordion>
          </div>
        </div>
      )}

      {isEditModalOpen && childDetail && (
        <ProfileChildDetailEditModal
          setIsOpen={setIsEditModalOpen}
          childBeingEdited={childDetail}
          editChild={async (payload: ChildDetailEditModalPayload) => {
            try {
              await editChild({
                variables: {
                  input: {
                    id: child.id,
                    ...payload,
                  },
                },
              });
            } catch (error) {
              toast.error(t('registration.submitMutation.errorMessage'));
              Sentry.captureException(error);
            }
          }}
          deleteChild={async () => {
            try {
              await deleteChild({
                variables: {
                  input: {
                    id: child.id,
                  },
                },
              });
            } catch (error) {
              toast.error(t('registration.submitMutation.errorMessage'));
              Sentry.captureException(error);
            }
          }}
        />
      )}
    </Accordion>
  );
};

export default ProfileChildAccordionItem;
