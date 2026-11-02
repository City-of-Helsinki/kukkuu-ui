import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import type { FilterOption, FilterOptionsHookResult } from '../types/filterTypes';

/**
 * Dedicated hook returning available options for the "Teemapolku" (Theme path) filter.
 * 1st-iteration defaults: Rytmi, Tarina, Jälki.
 */
export function useThemePathOptions(): FilterOptionsHookResult {
  const { t } = useTranslation();

  // TODO: Fetch theme paths dynamically from GraphQL API (themePaths query)
  // once backend branch KK-1578-theme-path is integrated.
  const options = useMemo<FilterOption[]>(
    () => [
      { value: 'rytmi', label: t('search.filter.themePaths.rytmi', 'Rytmi') },
      { value: 'tarina', label: t('search.filter.themePaths.tarina', 'Tarina') },
      { value: 'jalki', label: t('search.filter.themePaths.jalki', 'Jälki') },
    ],
    [t]
  );

  return { options, loading: false };
}

export default useThemePathOptions;
