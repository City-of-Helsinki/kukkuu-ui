import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Accordion,
  ButtonPresetTheme,
  Checkbox,
  DateInput,
  IconGlobe,
  IconPersonWheelchair,
  IconSearch,
  IconUser,
  Select,
  Tooltip,
} from 'hds-react';
import type { Option } from 'hds-react';

import Button from '../../../common/components/button/Button';
import { getCurrentLanguage } from '../../../common/translation/TranslationUtils';
import { useEventSearchFormContext } from './context/EventSearchFormContext';
import { useEventSearchResultsUiContext } from './context/EventSearchResultsUiContext';
import EventSearchFilterTags from './EventSearchFilterTags';
import styles from './childEventsSearch.module.scss';

/**
 * Renders the child selection dropdown and accessibility description.
 */
const ChildSelectorField: React.FC = () => {
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

  const handleChange = (selected: Option | Option[]) => {
    handleChildChange(selected);
  };

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
        onChange={handleChange}
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

/**
 * Renders the theme path multi-select filter field.
 */
const ThemePathFilterField: React.FC = () => {
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

/**
 * Renders the start date calendar input filter field.
 */
const StartDateFilterField: React.FC = () => {
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

/**
 * Renders the accessibility options multi-select filter field.
 */
const AccessibilityFilterField: React.FC = () => {
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

/**
 * Renders the event occurrence language multi-select filter field.
 */
const LanguageFilterField: React.FC = () => {
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

/**
 * Renders the toggle checkbox for available-only occurrences.
 */
const AvailableOnlyCheckboxField: React.FC = () => {
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

/**
 * Renders the toggle checkbox for family-only occurrences.
 */
const FamilyOnlyCheckboxField: React.FC = () => {
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

/**
 * Main search form component containing the child selector, collapsible filter accordion,
 * submit action button, and active filter tags.
 */
export const EventSearchFilterForm: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = getCurrentLanguage(i18n);
  const { submitButtonRef, submitSearch } = useEventSearchFormContext();
  const { searchFormRef } = useEventSearchResultsUiContext();

  return (
    <div className={styles.filterFormSection}>
      <h2 className={styles.formSectionHeading}>{t('search.formHeading')}</h2>

      <form
        id="child-events-search-form"
        ref={searchFormRef}
        onSubmit={submitSearch}
        className={styles.searchForm}
        noValidate
      >
        <ChildSelectorField />

        <div className={styles.accordionContainer}>
          <Accordion
            heading={t('search.filter.title')}
            headingLevel={3}
            card
            border
            initiallyOpen
            closeButton
            language={currentLang}
            className={styles.filterAccordion}
          >
            <div className={styles.accordionGrid}>
              <ThemePathFilterField />
              <StartDateFilterField />
              <AccessibilityFilterField />
              <LanguageFilterField />
              <AvailableOnlyCheckboxField />
              <FamilyOnlyCheckboxField />
            </div>
          </Accordion>
        </div>

        <div className={styles.formActions}>
          <Button
            type="submit"
            variant="primary"
            theme={ButtonPresetTheme.Black}
            iconStart={<IconSearch aria-hidden="true" />}
            ref={submitButtonRef}
            className={styles.submitButton}
          >
            {t('search.filter.submitButton')}
          </Button>
        </div>

        <EventSearchFilterTags />
      </form>
    </div>
  );
};

export default EventSearchFilterForm;
