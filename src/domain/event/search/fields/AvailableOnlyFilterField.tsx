import React from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox } from 'hds-react';

import { useEventSearchFormContext } from '../context/EventSearchFormContext';
import styles from '../childEventsSearch.module.scss';

/**
 * Renders the toggle checkbox for available-only occurrences.
 */
export const AvailableOnlyFilterField: React.FC = () => {
  const { t } = useTranslation();
  const { draftFilters, updateDraftFilter } = useEventSearchFormContext();

  const handleAvailableOnlyChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateDraftFilter('availableOnly', e.target.checked);
  };

  return (
    <div className={styles.gridField}>
      <Checkbox
        id="search-filter-available-only"
        label={t('search.filter.availableOnlyLabel')}
        checked={draftFilters.availableOnly}
        onChange={handleAvailableOnlyChange}
        className={styles.checkbox}
      />
    </div>
  );
};

export default AvailableOnlyFilterField;
