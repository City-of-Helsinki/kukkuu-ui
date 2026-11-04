import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconGlobe, Select } from 'hds-react';
import type { Option } from 'hds-react';

import { getCurrentLanguage } from '../../../../common/translation/TranslationUtils';
import { useEventSearchFormContext } from '../context/EventSearchFormContext';
import styles from '../childEventsSearch.module.scss';

/**
 * Renders the event occurrence language multi-select filter field.
 */
export const LanguageFilterField: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = getCurrentLanguage(i18n);
  const { draftFilters, languageOptions, updateDraftFilter } =
    useEventSearchFormContext();

  const selectedOptions = languageOptions.filter((opt) =>
    draftFilters.languages.includes(opt.value)
  );

  const handleLanguageChange = (selected: Option | Option[]) => {
    const list = Array.isArray(selected) ? selected : [selected];
    updateDraftFilter(
      'languages',
      list
        .map((item) => item?.value)
        .filter((v): v is string => Boolean(v))
    );
  };

  return (
    <div className={styles.gridField}>
      <Select
        id="search-filter-language"
        multiSelect
        noTags
        clearable={false}
        icon={<IconGlobe aria-hidden="true" />}
        options={languageOptions}
        value={selectedOptions}
        onChange={handleLanguageChange}
        texts={{
          label: t('search.filter.languageLabel'),
          placeholder: t('search.filter.languagePlaceholder'),
          language: currentLang,
        }}
        className={styles.filterSelect}
      />
    </div>
  );
};

export default LanguageFilterField;
