import React from 'react';
import { useTranslation } from 'react-i18next';
import { Breadcrumb } from 'hds-react';
import type { BreadcrumbListItem } from 'hds-react';

import useGetPathname from '../../../common/route/utils/useGetPathname';
import PageMeta from '../../app/layout/utilityComponents/PageMeta';
import EventHero, { EventHeroEvent, EventHeroOccurrence } from '../eventHero/EventHero';
import EventContent from '../eventContent/EventContent';
import type { EventSidebarOccurrence } from '../eventContent/EventInfoSidebar';
import styles from './eventDetailsPage.module.scss';

export interface EventDetailsPageProps {
  event: EventHeroEvent & {
    name?: string | null;
    description?: string | null;
    shortDescription?: string | null;
    duration?: number | null;
  };
  selectedOccurrence?: (EventHeroOccurrence & EventSidebarOccurrence) | null;
  otherOccurrences?: EventSidebarOccurrence[];
  childId: string;
  backTo?: string;
  children?: React.ReactNode;
}

export const EventDetailsPage: React.FC<EventDetailsPageProps> = ({
  event,
  selectedOccurrence,
  otherOccurrences,
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
      path: getPathname(`/profile/child/${childId}/events`),
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
          selectedOccurrence={selectedOccurrence}
          childId={childId}
          backTo={backTo}
        />
        <EventContent
          event={event}
          selectedOccurrence={selectedOccurrence}
          otherOccurrences={otherOccurrences}
          childId={childId}
        >
          {children}
        </EventContent>
      </div>
    </>
  );
};

export default EventDetailsPage;
