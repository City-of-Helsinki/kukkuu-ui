import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ContentContainer,
  PageSection,
} from '@city-of-helsinki/react-helsinki-headless-cms';

import Paragraph from '../../../common/components/paragraph/Paragraph';
import EventInfoSidebar, {
  EventSidebarEvent,
  EventSidebarOccurrence,
} from './EventInfoSidebar';
import styles from './eventContent.module.scss';

export type EventVenueInfo = {
  id?: string;
  name?: string | null;
  description?: string | null;
};

export type EventContentProps = {
  event: EventSidebarEvent & {
    name?: string | null;
    description?: string | null;
  };
  occurrences?: EventSidebarOccurrence[];
  venues?: EventVenueInfo[];
  children?: React.ReactNode;
};

export type EventVenuesSectionProps = {
  venues: Array<EventVenueInfo & { description: string }>;
};

export const EventVenuesSection: React.FC<EventVenuesSectionProps> = ({
  venues,
}) => {
  const { t } = useTranslation();

  if (venues.length === 0) {
    return null;
  }

  return (
    <div className={styles.venueInfoCard} data-testid="venue-info-card">
      <h3 className={styles.venueInfoTitle}>{t('event.venueInfo.title')}</h3>
      <div className={styles.venueInfoBody}>
        {venues.map((venue, idx) => (
          <div key={venue.id || idx} className={styles.venueItem}>
            {venues.length > 1 && venue.name && (
              <h4 className={styles.venueNameHeader}>{venue.name}</h4>
            )}
            <Paragraph text={venue.description} />
          </div>
        ))}
      </div>
    </div>
  );
};

export const EventContent: React.FC<EventContentProps> = ({
  event,
  occurrences,
  venues = [],
  children,
}) => {
  const { t } = useTranslation();

  const venuesWithDescription = venues.filter(
    (v): v is EventVenueInfo & { description: string } =>
      Boolean(v.description && v.description.trim().length > 0)
  );

  return (
    <PageSection className={styles.eventContentSection}>
      <ContentContainer className={styles.contentContainer}>
        <div className={styles.grid}>
          <div className={styles.mainColumn}>
            {event.description && (
              <div className={styles.descriptionSection}>
                <h2 className={styles.descriptionTitle}>
                  {t('event.description.title')}
                </h2>
                <div className={styles.description}>
                  <Paragraph text={event.description} />
                </div>
              </div>
            )}

            <EventVenuesSection venues={venuesWithDescription} />

            {children}
          </div>

          <div className={styles.sidebarColumn}>
            <EventInfoSidebar
              event={event}
              occurrences={occurrences}
            />
          </div>
        </div>
      </ContentContainer>
    </PageSection>
  );
};

export default EventContent;
