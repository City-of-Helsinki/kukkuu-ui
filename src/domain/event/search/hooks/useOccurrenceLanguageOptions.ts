import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import type { FilterOption, FilterOptionsHookResult } from '../types/filterTypes';

/**
 * Dedicated hook returning available options for the "Kieli" (Language) filter.
 * 1st-iteration defaults: Finnish (fi), Swedish (sv), English (en) from the Occurrence model.
 */
export function useOccurrenceLanguageOptions(): FilterOptionsHookResult {
  const { t } = useTranslation();

  // TODO: Fetch occurrence languages dynamically from GraphQL API
  // once the backend languages endpoint for event occurrences is used.
  const options = useMemo<FilterOption[]>(
    () => [
      { value: 'fi', label: t('search.filter.languages.fi', 'Suomi') },
      { value: 'sv', label: t('search.filter.languages.sv', 'Ruotsi') },
      { value: 'en', label: t('search.filter.languages.en', 'Englanti') },
    ],
    [t]
  );

  return { options, loading: false };
}

export default useOccurrenceLanguageOptions;
