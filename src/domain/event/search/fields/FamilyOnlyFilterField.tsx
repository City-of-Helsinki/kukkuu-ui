import React from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox } from 'hds-react';

import { useEventSearchFormContext } from '../context/EventSearchFormContext';
import styles from '../childEventsSearch.module.scss';

/**
 * Renders the toggle checkbox for family-only occurrences.
 */
export const FamilyOnlyFilterField: React.FC = () => {
  const { t } = useTranslation();
  const { draftFilters, updateDraftFilter } = useEventSearchFormContext();

  const handleFamilyOnlyChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateDraftFilter('familyOnly', e.target.checked);
  };

  return (
    <div className={styles.gridField}>
      <Checkbox
        id="search-filter-family-only"
        label={t('search.filter.familyOnlyLabel')}
        checked={draftFilters.familyOnly}
        onChange={handleFamilyOnlyChange}
        className={styles.checkbox}
      />
    </div>
  );
};

export default FamilyOnlyFilterField;
