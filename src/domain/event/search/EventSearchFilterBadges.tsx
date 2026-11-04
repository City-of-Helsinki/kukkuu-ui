import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconCross, Tag } from 'hds-react';

import Button from '../../../common/components/button/Button';
import { useEventSearchFormContext } from './context/EventSearchFormContext';
import styles from './childEventsSearch.module.scss';

/**
 * Renders active filter badges as a list of removable pills followed by
 * a clear-all button. Returns early (null) when no badges are active.
 */
export const EventSearchFilterBadges: React.FC = () => {
  const { t } = useTranslation();
  const { activeBadges, removeBadge, clearAllFilters, registerBadgeRef } =
    useEventSearchFormContext();

  if (activeBadges.length === 0) {
    return null;
  }

  return (
    <section
      className={styles.filterBadgesWrapper}
      aria-label={t('search.filter.activeFilters', 'Valitut suodattimet')}
    >
      <div className={styles.filterBadgesList}>
        {activeBadges.map((badge) => (
          <Tag
            key={badge.id}
            role="button"
            aria-label={t('search.filter.removeFilter', {
              filter: badge.label,
            })}
            onDelete={() => removeBadge(badge)}
            className={styles.filterBadge}
            ref={(el) => registerBadgeRef(badge.id, el as HTMLElement | null)}
          >
            {badge.label}
          </Tag>
        ))}
      </div>
      <Button
        variant="supplementary"
        type="button"
        className={styles.clearAllButton}
        onClick={clearAllFilters}
      >
        <IconCross aria-hidden="true" className={styles.clearIcon} />
        {t('search.filter.clearButton')}
      </Button>
    </section>
  );
};

export default EventSearchFilterBadges;
