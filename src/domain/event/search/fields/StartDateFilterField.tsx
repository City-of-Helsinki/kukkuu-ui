import React from 'react';
import { useTranslation } from 'react-i18next';
import { DateInput } from 'hds-react';

import { getCurrentLanguage } from '../../../../common/translation/TranslationUtils';
import { useEventSearchFormContext } from '../context/EventSearchFormContext';
import styles from '../childEventsSearch.module.scss';

/**
 * Renders the start date calendar input filter field.
 */
export const StartDateFilterField: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = getCurrentLanguage(i18n);
  const { draftFilters, updateDraftFilter } = useEventSearchFormContext();

  const handleStartDateChange = (val: string) => {
    updateDraftFilter('startDate', val);
  };

  return (
    <div className={styles.gridField}>
      <DateInput
        id="search-filter-date"
        label={t('search.filter.dateLabel')}
        placeholder={t('search.filter.datePlaceholder')}
        value={draftFilters.startDate}
        onChange={handleStartDateChange}
        language={currentLang}
        selectButtonLabel={t('common.select.default.text')}
        closeButtonLabel={t('search.filter.close')}
        className={styles.dateInput}
      />
    </div>
  );
};

export default StartDateFilterField;
