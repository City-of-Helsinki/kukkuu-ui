import React from 'react';
import {
  ContentContainer,
  PageSection,
} from '@city-of-helsinki/react-helsinki-headless-cms';

import EventInfoSidebar, {
  EventSidebarEvent,
  EventSidebarOccurrence,
} from './EventInfoSidebar';
import styles from './eventContent.module.scss';

export interface EventContentProps {
  event: EventSidebarEvent & {
    name?: string | null;
    description?: string | null;
  };
  selectedOccurrence?: EventSidebarOccurrence | null;
  otherOccurrences?: EventSidebarOccurrence[];
  childId: string;
  children?: React.ReactNode;
}

export const EventContent: React.FC<EventContentProps> = ({
  event,
  selectedOccurrence,
  otherOccurrences,
  childId,
  children,
}) => {
  return (
    <PageSection className={styles.eventContentSection}>
      <ContentContainer className={styles.contentContainer}>
        <div className={styles.grid}>
          <div className={styles.mainColumn}>{children}</div>

          <div className={styles.sidebarColumn}>
            <EventInfoSidebar
              event={event}
              selectedOccurrence={selectedOccurrence}
              otherOccurrences={otherOccurrences}
              childId={childId}
            />
          </div>
        </div>
      </ContentContainer>
    </PageSection>
  );
};

export default EventContent;
