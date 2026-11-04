import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconPersonWheelchair, Select } from 'hds-react';
import type { Option } from 'hds-react';

import { getCurrentLanguage } from '../../../../common/translation/TranslationUtils';
import { useEventSearchFormContext } from '../context/EventSearchFormContext';
import styles from '../childEventsSearch.module.scss';

/**
 * Renders the accessibility options multi-select filter field.
 */
export const AccessibilityFilterField: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = getCurrentLanguage(i18n);
  const { draftFilters, accessibilityOptions, updateDraftFilter } =
    useEventSearchFormContext();

  const selectedOptions = accessibilityOptions.filter((opt) =>
    draftFilters.accessibility.includes(opt.value)
  );

  const handleAccessibilityChange = (selected: Option | Option[]) => {
    const list = Array.isArray(selected) ? selected : [selected];
    updateDraftFilter(
      'accessibility',
      list
        .map((item) => item?.value)
        .filter((v): v is string => Boolean(v))
    );
  };

  return (
    <div className={styles.gridField}>
      <Select
        id="search-filter-accessibility"
        multiSelect
        noTags
        clearable={false}
        disabled
        icon={<IconPersonWheelchair aria-hidden="true" />}
        options={accessibilityOptions}
        value={selectedOptions}
        onChange={handleAccessibilityChange}
        texts={{
          label: t('search.filter.accessibilityLabel'),
          placeholder: t('search.filter.accessibilityPlaceholder'),
          language: currentLang,
        }}
        className={styles.filterSelect}
      />
    </div>
  );
};

export default AccessibilityFilterField;
