import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { IconUser, Select } from 'hds-react';

import { getCurrentLanguage } from '../../../../common/translation/TranslationUtils';
import { useEventSearchFormContext } from '../context/EventSearchFormContext';
import styles from '../childEventsSearch.module.scss';

/**
 * Renders the guardian's child selection dropdown and accessibility description.
 */
export const ChildSelectorField: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = getCurrentLanguage(i18n);
  const { childrenOptions, selectedChildOptions, handleChildChange } =
    useEventSearchFormContext();

  // HDS Select 6.x forwards `aria-describedby` to the surrounding container
  // element instead of the combobox button. Attach it to the button as well so
  // screen readers announce the description when the selector receives focus.
  const childSelectRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    childSelectRef.current?.setAttribute(
      'aria-describedby',
      'child-selector-description'
    );
    // Re-run when the selector is (re)mounted once children options load.
  }, [childrenOptions.length]);

  if (childrenOptions.length === 0) {
    return null;
  }

  return (
    <div className={styles.childSelectWrapper}>
      <Select
        ref={childSelectRef}
        id="child-selector"
        icon={<IconUser aria-hidden="true" />}
        aria-describedby="child-selector-description"
        required
        options={childrenOptions}
        value={selectedChildOptions}
        onChange={handleChildChange}
        texts={{
          label: t('search.hero.selectChildRequired'),
          placeholder: t('search.hero.selectChildPlaceholder'),
          language: currentLang,
        }}
        className={styles.childSelect}
      />
      <span id="child-selector-description" className="visually-hidden">
        {t('search.childSelector.description')}
      </span>
    </div>
  );
};

export default ChildSelectorField;
