import React from 'react';
import { useTranslation } from 'react-i18next';
import { Select, Tooltip } from 'hds-react';
import type { Option } from 'hds-react';

import { getCurrentLanguage } from '../../../../common/translation/TranslationUtils';
import { useEventSearchFormContext } from '../context/EventSearchFormContext';
import styles from '../childEventsSearch.module.scss';

/**
 * Renders the theme path multi-select filter field.
 */
export const ThemePathFilterField: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = getCurrentLanguage(i18n);
  const { draftFilters, themePathOptions, updateDraftFilter } =
    useEventSearchFormContext();

  const selectedOptions = themePathOptions.filter((opt) =>
    draftFilters.themePaths.includes(opt.value)
  );

  const handleThemePathChange = (selected: Option | Option[]) => {
    const list = Array.isArray(selected) ? selected : [selected];
    updateDraftFilter(
      'themePaths',
      list
        .map((item) => item?.value)
        .filter((v): v is string => Boolean(v))
    );
  };

  return (
    <div className={styles.gridField}>
      <Select
        id="search-filter-theme-path"
        multiSelect
        noTags
        clearable={false}
        options={themePathOptions}
        value={selectedOptions}
        onChange={handleThemePathChange}
        texts={{
          label: t('search.filter.themePathLabel'),
          placeholder: t('search.filter.themePathPlaceholder'),
          language: currentLang,
        }}
        tooltip={
          <Tooltip placement="top">
            {t('search.filter.themePathTooltip')}
          </Tooltip>
        }
        className={styles.filterSelect}
      />
    </div>
  );
};

export default ThemePathFilterField;
