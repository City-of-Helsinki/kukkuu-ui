import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import useQuery from '../../../api/useQuery';
import RelayList from '../../../api/relayList';
import type {
  ThemePathFieldsFragment,
  ThemePathsQuery,
} from '../../../api/generatedTypes/graphql';
import { getCurrentLanguage } from '../../../../common/translation/TranslationUtils';
import { themePathsQuery } from '../../queries/themePathsQuery';
import type {
  FilterOption,
  FilterOptionsHookResult,
} from '../types/filterTypes';

const ThemePathList = RelayList<ThemePathFieldsFragment>();

/**
 * Dedicated hook returning available options for the "Teemapolku" (Theme path) filter.
 */
export function useThemePathOptions(): FilterOptionsHookResult {
  const { i18n } = useTranslation();
  const currentLanguage = getCurrentLanguage(i18n);
  const previousLanguageRef = useRef(currentLanguage);

  const { data, loading, refetch } = useQuery<ThemePathsQuery>(
    themePathsQuery,
    {
      useDefaultErrorHandling: true,
      fetchPolicy: 'cache-and-network',
      context: {
        headers: {
          'accept-language': currentLanguage,
        },
      },
    }
  );

  useEffect(() => {
    if (previousLanguageRef.current !== currentLanguage) {
      previousLanguageRef.current = currentLanguage;
      void refetch();
    }
  }, [currentLanguage, refetch]);

  const options = useMemo<FilterOption[]>(
    () =>
      ThemePathList(data?.themePaths)
        .items.filter((node) => Boolean(node.slug))
        .map((node) => ({
          value: node.slug,
          label: node.name || node.slug,
        })),
    [data?.themePaths]
  );

  return { options, loading };
}

export default useThemePathOptions;
