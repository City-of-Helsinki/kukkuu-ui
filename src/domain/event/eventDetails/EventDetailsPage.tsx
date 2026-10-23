import React from 'react';
import { useTranslation } from 'react-i18next';
import { Breadcrumb } from 'hds-react';
import type { BreadcrumbListItem } from 'hds-react';

import useGetPathname from '../../../common/route/utils/useGetPathname';
import PageMeta from '../../app/layout/utilityComponents/PageMeta';
import EventHero, {
  EventHeroEvent,
  EventHeroOccurrence,
} from '../eventHero/EventHero';
import EventContent, { EventVenueInfo } from '../eventContent/EventContent';
import type { EventSidebarOccurrence } from '../eventContent/EventInfoSidebar';
import EventOccurrencesTableSection from './EventOccurrencesTableSection';
import type { EventOccurrencesTableOccurrence } from './EventOccurrencesTable';
import { EventParticipantsPerInvite } from '../../api/generatedTypes/graphql';
import styles from './eventDetailsPage.module.scss';

export type EventDetailsPageOccurrence = EventHeroOccurrence &
  EventSidebarOccurrence &
  EventOccurrencesTableOccurrence;

export type EventDetailsPageProps = {
  event: EventHeroEvent & {
    name?: string | null;
    description?: string | null;
    shortDescription?: string | null;
    duration?: number | null;
    capacityPerOccurrence?: number | null;
    participantsPerInvite?: EventParticipantsPerInvite | null;
    eventGroup?: { id: string } | null;
  };
  allOccurrences?: EventDetailsPageOccurrence[];
  venues?: EventVenueInfo[];
  childId: string;
  backTo?: string;
  children?: React.ReactNode;
};

export const EventDetailsPage: React.FC<EventDetailsPageProps> = ({
  event,
  allOccurrences = [],
  venues = [],
  childId,
  backTo,
  children,
}) => {
  const { t } = useTranslation();
  const getPathname = useGetPathname();

  const breadcrumbs: BreadcrumbListItem[] = [
    {
      title: t('common.breadcrumbs.home'),
      path: getPathname('/'),
    },
    {
      title: t('common.breadcrumbs.events'),
      path: backTo || getPathname(`/profile/child/${childId}/events`),
    },
    {
      title: event.name || '',
      path: null,
    },
  ];

  return (
    <>
      <PageMeta
        title={event.name || undefined}
        description={event.shortDescription || undefined}
      />
      <div className={styles.eventDetailsPage}>
        <div className={styles.breadcrumbsWrapper}>
          <Breadcrumb
            aria-label={t('common.breadcrumbNavigationLabel')}
            list={breadcrumbs}
            className={styles.breadcrumbs}
          />
        </div>
        <EventHero
          event={event}
          allOccurrences={allOccurrences}
          childId={childId}
        />
        <EventContent
          event={event}
          occurrences={allOccurrences}
          venues={venues}
        >
          {children}
        </EventContent>

        <EventOccurrencesTableSection
          event={event}
          occurrences={allOccurrences}
          childId={childId}
        />
      </div>
    </>
  );
};

export default EventDetailsPage;
