import React from 'react';
import { useTranslation } from 'react-i18next';
import { Notification } from 'hds-react';

import { useEventSearchResultsUiContext } from './context/EventSearchResultsUiContext';
import { useEventSearchFormContext } from './context/EventSearchFormContext';
import styles from './childEventsSearch.module.scss';

export const ChildThemePathNotification: React.FC = () => {
  const { t } = useTranslation();
  const { visibleChildThemePath, activeChildName, dismissThemePathNotice } =
    useEventSearchResultsUiContext();
  const { applyThemePathFilter } = useEventSearchFormContext();

  if (!visibleChildThemePath) {
    return null;
  }

  const handleApplyClick = () => {
    applyThemePathFilter(visibleChildThemePath.slug);
  };

  return (
    <div className={styles.themePathNotificationWrapper}>
      <Notification
        type="info"
        dismissible
        closeButtonLabelText={t('search.notification.dismissNotice')}
        onClose={dismissThemePathNotice}
        className={styles.themePathNotification}
      >
        <p className={styles.notificationText}>
          {t('search.notification.childThemePath', {
            name: activeChildName,
            themePath: visibleChildThemePath.name,
          })}
        </p>
        <button
          type="button"
          onClick={handleApplyClick}
          className={styles.themePathActionLink}
        >
          {t('search.notification.applyThemePath', {
            themePath: visibleChildThemePath.name,
          })}
        </button>
      </Notification>
    </div>
  );
};

export default ChildThemePathNotification;
