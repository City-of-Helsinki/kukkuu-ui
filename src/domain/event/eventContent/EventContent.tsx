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
  const { t } = useTranslation();

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
            {children}
          </div>

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
