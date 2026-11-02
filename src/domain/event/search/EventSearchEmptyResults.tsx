import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconFaceSad } from 'hds-react';

import { useEventSearchResultsUiContext } from './context/EventSearchResultsUiContext';
import styles from './childEventsSearch.module.scss';

/**
 * Renders when no events match the selected child's filters.
 * Displays a sad-face placeholder icon, a personalized heading with the child's name,
 * and advice text encouraging the user to adjust search criteria.
 */
export const EventSearchEmptyResults: React.FC = () => {
  const { t } = useTranslation();
  const { activeChildName } = useEventSearchResultsUiContext();

  return (
    <output className={styles.emptyResultsWrapper}>
      <div className={styles.emptyIconCircle}>
        <IconFaceSad aria-hidden="true" className={styles.sadIcon} />
      </div>
      <h2 className={styles.emptyHeading}>
        {t('search.results.noResultsForChild', {
          name: activeChildName,
        })}
      </h2>
      <p className={styles.emptyAdvice}>
        {t('search.results.noResultsAdvice')}
      </p>
    </output>
  );
};

export default EventSearchEmptyResults;
