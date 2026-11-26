import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconPersonWheelchair, Select, Tooltip } from 'hds-react';
import type { Option } from 'hds-react';

import { getCurrentLanguage } from '../../../../common/translation/TranslationUtils';
import { useEventSearchFormContext } from '../context/EventSearchFormContext';
import styles from '../childEventsSearch.module.scss';

/**
 * Renders the accessibility options multi-select filter field with a dynamic
 * tooltip built from the fetched accessibility names and descriptions.
 */
export const AccessibilityFilterField: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = getCurrentLanguage(i18n);
  const { draftFilters, accessibilityOptions, updateDraftFilter } =
    useEventSearchFormContext();

  const selectedOptions = accessibilityOptions.filter((opt) =>
    draftFilters.accessibility.includes(opt.value)
  );

  const tooltipItems = accessibilityOptions.filter((opt) =>
    Boolean(opt.description?.trim())
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
        icon={<IconPersonWheelchair aria-hidden="true" />}
        options={accessibilityOptions}
        value={selectedOptions}
        onChange={handleAccessibilityChange}
        texts={{
          label: t('search.filter.accessibilityLabel'),
          placeholder: t('search.filter.accessibilityPlaceholder'),
          language: currentLang,
        }}
        tooltip={
          tooltipItems.length > 0 ? (
            <Tooltip
              placement="top"
              buttonLabel={t('search.filter.accessibilityTooltipButtonLabel')}
              tooltipLabel={t('search.filter.accessibilityTooltipLabel')}
            >
              <ul className={styles.accessibilityTooltipList}>
                {tooltipItems.map((item) => (
                  <li key={item.value}>
                    <strong>{item.label}:</strong> {item.description}
                  </li>
                ))}
              </ul>
            </Tooltip>
          ) : undefined
        }
        className={styles.filterSelect}
      />
    </div>
  );
};

export default AccessibilityFilterField;
