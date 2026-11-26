import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { ButtonPresetTheme, Notification } from 'hds-react';

import Button from '../../../common/components/button/Button';
import useGetPathname from '../../../common/route/utils/useGetPathname';
import { useEventSearchResultsUiContext } from './context/EventSearchResultsUiContext';
import styles from './childEventsSearch.module.scss';

/**
 * Renders an inline HDS error notification when loading search results fails,
 * providing a retry action and a link back to the user's profile.
 */
export const EventSearchError: React.FC = () => {
  const { t } = useTranslation();
  const getPathname = useGetPathname();
  const { retry } = useEventSearchResultsUiContext();

  return (
    <section
      className={styles.resultsSection}
      aria-label={t('search.results.sectionLabel', 'Hakutulokset')}
    >
      <Notification
        type="error"
        label={t('search.error.title')}
        className={styles.searchErrorNotification}
      >
        <p>{t('search.error.failedToLoadEvents')}</p>
        <div className={styles.searchErrorActions}>
          <Button
            variant="secondary"
            theme={ButtonPresetTheme.Black}
            onClick={retry}
          >
            {t('search.error.retryButton')}
          </Button>
          <Link to={getPathname('/profile')} className={styles.searchErrorLink}>
            {t('search.error.returnToProfile')}
          </Link>
        </div>
      </Notification>
    </section>
  );
};

export default EventSearchError;
