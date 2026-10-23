import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { IconCalendar, IconGlobe, IconLocation } from 'hds-react';

import PlaceholderImage from '../../../common/components/placeholderImage/PlaceholderImage';
import LinkButton from '../../../common/components/button/LinkButton';
import useGetPathname from '../../../common/route/utils/useGetPathname';
import {
  getEventLanguageText,
  getEventTimeText,
  getEventVenueText,
} from './eventSearchUtils';
import type { AvailableEvent } from '../types/ChildAvailableOccurrencesTypes';
import styles from './occurrenceCard.module.scss';

export type EventSearchCardProps = {
  childId: string;
  event: AvailableEvent;
};

export const EventSearchCard: React.FC<EventSearchCardProps> = ({
  childId,
  event,
}) => {
  const { t, i18n } = useTranslation();
  const getPathname = useGetPathname();

  const formattedTime = getEventTimeText(event, t, i18n.language);
  const venueText = getEventVenueText(event);
  const languageText = getEventLanguageText(event, t);
  const detailsUrl = getPathname(`/profile/child/${childId}/event/${event.id}`);

  return (
    <article
      className={styles.occurrenceCard}
      data-testid={`event-card-${event.id}`}
    >
      <div className={styles.imageWrapper}>
        {event.image ? (
          <img
            src={event.image}
            alt={event.imageAltText || event.name || ''}
            className={styles.image}
          />
        ) : (
          <PlaceholderImage />
        )}
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.topRow}>
          <div className={styles.header}>
            <h3 className={styles.title}>{event.name}</h3>
            {event.shortDescription && (
              <p className={styles.shortDescription}>{event.shortDescription}</p>
            )}
          </div>
        </div>

        <div className={styles.metadata}>
          {formattedTime && (
            <div className={styles.metaRow}>
              <IconCalendar aria-hidden="true" className={styles.icon} />
              <span>{formattedTime}</span>
            </div>
          )}
          {venueText && (
            <div className={styles.metaRow}>
              <IconLocation aria-hidden="true" className={styles.icon} />
              <span>{venueText}</span>
            </div>
          )}
          {languageText && (
            <div className={styles.metaRow}>
              <IconGlobe aria-hidden="true" className={styles.icon} />
              <span>{languageText}</span>
            </div>
          )}
        </div>

        <div className={styles.badgeList} />

        <div className={styles.actions}>
          <LinkButton
            to={detailsUrl}
            className={classNames(
              styles.actionButton,
              styles.actionButtonFullWidth
            )}
          >
            {t('search.card.readMoreButton')}
          </LinkButton>
        </div>
      </div>
    </article>
  );
};

export default EventSearchCard;
