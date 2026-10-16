import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconClock, IconGlobe, IconLocation } from 'hds-react';

import PlaceholderImage from '../../../common/components/placeholderImage/PlaceholderImage';
import OccurrenceDateBadge from '../../../common/components/occurrenceDateBadge/OccurrenceDateBadge';
import LinkButton from '../../../common/components/button/LinkButton';
import Button from '../../../common/components/button/Button';
import { formatOccurrenceTimeRange } from '../../../common/time/occurrenceTime';
import { isOccurrenceEnrollable } from './occurrenceSearchUtils';
import type { FlattenedOccurrenceItem } from '../types/ChildAvailableOccurrencesTypes';
import styles from './occurrenceCard.module.scss';

export interface OccurrenceCardProps {
  childId: string;
  item: FlattenedOccurrenceItem;
}

export const OccurrenceCard: React.FC<OccurrenceCardProps> = ({
  childId,
  item,
}) => {
  const { t } = useTranslation();
  const { event, occurrence } = item;
  const canEnroll = isOccurrenceEnrollable(item);

  const formattedTime = formatOccurrenceTimeRange(
    occurrence.time,
    event.duration
  );
  const venueText = [occurrence.venue?.name, occurrence.venue?.address]
    .filter(Boolean)
    .join(', ');

  const languageText = occurrence.occurrenceLanguage
    ? t('search.card.languages', {
        languages: t(
          `common.language.${occurrence.occurrenceLanguage.toLowerCase()}`
        ),
      })
    : null;

  const enrolUrl = `/profile/child/${childId}/event/${event.id}/occurrence/${occurrence.id}/enrol`;
  const detailsUrl = `/profile/child/${childId}/event/${event.id}?occurrenceId=${occurrence.id}`;

  return (
    <article
      className={styles.occurrenceCard}
      data-testid={`occurrence-card-${occurrence.id}`}
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
        <div className={styles.badgeWrapper}>
          <OccurrenceDateBadge time={occurrence.time} />
        </div>
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <h3 className={styles.title}>{event.name}</h3>
          {event.shortDescription && (
            <p className={styles.shortDescription}>{event.shortDescription}</p>
          )}
        </div>

        <div className={styles.metadata}>
          {formattedTime && (
            <div className={styles.metaRow}>
              <IconClock aria-hidden="true" className={styles.icon} />
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

        <div className={styles.badgeList}>
          <span className={styles.pill}>{t('search.card.badgeExample1')}</span>
          <span className={styles.pill}>{t('search.card.badgeExample2')}</span>
        </div>

        <div className={styles.actions}>
          {canEnroll ? (
            <LinkButton
              to={enrolUrl}
              variant="primary"
              className={styles.actionButton}
            >
              {t('search.card.enrolButton')}
            </LinkButton>
          ) : (
            <Button
              variant="disabled"
              disabled
              aria-disabled="true"
              className={styles.actionButton}
            >
              {t('search.card.enrolButton')}
            </Button>
          )}
          <LinkButton
            to={detailsUrl}
            variant="secondary"
            className={styles.actionButton}
          >
            {t('search.card.readMoreButton')}
          </LinkButton>
        </div>
      </div>
    </article>
  );
};

export default OccurrenceCard;
