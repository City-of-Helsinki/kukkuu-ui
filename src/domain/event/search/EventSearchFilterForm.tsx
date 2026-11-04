import React from 'react';
import { useTranslation } from 'react-i18next';
import { Accordion, ButtonPresetTheme, IconSearch } from 'hds-react';

import Button from '../../../common/components/button/Button';
import { getCurrentLanguage } from '../../../common/translation/TranslationUtils';
import { useEventSearchFormContext } from './context/EventSearchFormContext';
import { useEventSearchResultsUiContext } from './context/EventSearchResultsUiContext';
import EventSearchFilterBadges from './EventSearchFilterBadges';
import {
  AccessibilityFilterField,
  AvailableOnlyFilterField,
  ChildSelectorField,
  FamilyOnlyFilterField,
  LanguageFilterField,
  StartDateFilterField,
  ThemePathFilterField,
} from './fields';
import styles from './childEventsSearch.module.scss';

/**
 * Main search form component containing the child selector, collapsible filter accordion,
 * submit action button, and active filter badges.
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
              <AvailableOnlyFilterField />
              <FamilyOnlyFilterField />
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

        <EventSearchFilterBadges />
      </form>
    </div>
  );
};

export default EventSearchFilterForm;
