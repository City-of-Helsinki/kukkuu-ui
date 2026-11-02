import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { ContentContainer } from '@city-of-helsinki/react-helsinki-headless-cms';

import { useEventSearchResultsUiContext } from './context/EventSearchResultsUiContext';
import styles from './childEventsSearch.module.scss';

export const StickySearchHeader: React.FC = () => {
  const { t } = useTranslation();
  const { isSticky, activeChildName, focusChildSelector } =
    useEventSearchResultsUiContext();

  if (!activeChildName) {
    return null;
  }

  const handleEditSearchClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    focusChildSelector();
  };

  return (
    <aside
      className={classNames(
        styles.stickyChildHeader,
        isSticky && styles.stickyChildHeaderVisible
      )}
      aria-hidden={!isSticky}
      aria-label={t('search.stickyHeader.resultsForChild')}
    >
      <ContentContainer className={styles.stickyContentContainer}>
        <div className={styles.stickyBarContent}>
          <div className={styles.stickyChildInfo}>
            <span className={styles.stickyLabel}>
              {t('search.stickyHeader.resultsForChild')}
            </span>
            <span className={styles.stickyChildBadge}>{activeChildName}</span>
          </div>
          <a
            href="#child-selector"
            aria-label={t('search.stickyHeader.editSearch')}
            className={styles.editSearchLink}
            onClick={handleEditSearchClick}
            tabIndex={isSticky ? 0 : -1}
          >
            {t('search.stickyHeader.editSearch')}
          </a>
        </div>
      </ContentContainer>
    </aside>
  );
};

export default StickySearchHeader;
