import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import type { FilterOption, FilterOptionsHookResult } from '../types/filterTypes';

/**
 * Dedicated hook returning available options for the "Kieli" (Language) filter.
 * Uses ISO 639-3 alpha-3 codes matching `events(languages: [String])`.
 */
export function useOccurrenceLanguageOptions(): FilterOptionsHookResult {
  const { t } = useTranslation();

  // TODO: Fetch occurrence languages dynamically from GraphQL API (`Query.languages`)
  // once search filter tests mock it.
  const options = useMemo<FilterOption[]>(
    () => [
      { value: 'fin', label: t('search.filter.languages.fin', 'Suomi') },
      { value: 'swe', label: t('search.filter.languages.swe', 'Ruotsi') },
      { value: 'eng', label: t('search.filter.languages.eng', 'Englanti') },
    ],
    [t]
  );

  return { options, loading: false };
}

export default useOccurrenceLanguageOptions;
