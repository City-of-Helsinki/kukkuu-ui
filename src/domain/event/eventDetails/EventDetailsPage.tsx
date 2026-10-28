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
import EventContent from '../eventContent/EventContent';
import type { EventSidebarOccurrence } from '../eventContent/EventInfoSidebar';
import EventOccurrencesTableSection from './EventOccurrencesTableSection';
import type { EventOccurrencesTableOccurrence } from './EventOccurrencesTable';
import EventTicketSystemSection from './EventTicketSystemSection';
import { externalTicketSystems } from '../constants/ExternalTicketSystemConstants';
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
  childId: string;
  children?: React.ReactNode;
};

export const EventDetailsPage: React.FC<EventDetailsPageProps> = ({
  event,
  allOccurrences = [],
  childId,
  children,
}) => {
  const { t } = useTranslation();
  const getPathname = useGetPathname();

  const isExternalTicketSystem = Boolean(
    event.ticketSystem?.type &&
      externalTicketSystems.includes(event.ticketSystem.type)
  );

  const breadcrumbs: BreadcrumbListItem[] = [
    {
      title: t('common.breadcrumbs.home'),
      path: getPathname('/'),
    },
    {
      title: t('common.breadcrumbs.events'),
      path: `${getPathname('/events')}?child=${encodeURIComponent(childId)}`,
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
        >
          {children}
        </EventContent>

        {isExternalTicketSystem ? (
          <EventTicketSystemSection event={event} childId={childId} />
        ) : (
          <EventOccurrencesTableSection
            event={event}
            occurrences={allOccurrences}
            childId={childId}
          />
        )}
      </div>
    </>
  );
};

export default EventDetailsPage;
