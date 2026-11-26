import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import useQuery from '../../../api/useQuery';
import RelayList from '../../../api/relayList';
import type {
  AccessibilitiesQuery,
  AccessibilityFieldsFragment,
} from '../../../api/generatedTypes/graphql';
import { getCurrentLanguage } from '../../../../common/translation/TranslationUtils';
import { accessibilitiesQuery } from '../../queries/accessibilitiesQuery';
import type {
  FilterOption,
  FilterOptionsHookResult,
} from '../types/filterTypes';

const AccessibilityList = RelayList<AccessibilityFieldsFragment>();

/**
 * Dedicated hook returning available options for the "Saavutettavuus" (Accessibility) filter,
 * including localized descriptions for the filter tooltip.
 */
export function useAccessibilityOptions(): FilterOptionsHookResult {
  const { i18n } = useTranslation();
  const currentLanguage = getCurrentLanguage(i18n);
  const previousLanguageRef = useRef(currentLanguage);

  const { data, loading, refetch } = useQuery<AccessibilitiesQuery>(
    accessibilitiesQuery,
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
      AccessibilityList(data?.accessibilities)
        .items.filter((node) => Boolean(node.slug))
        .map((node) => {
          const description = node.description?.trim();
          return {
            value: node.slug,
            label: node.name || node.slug,
            ...(description ? { description } : {}),
          };
        }),
    [data?.accessibilities]
  );

  return { options, loading };
}

export default useAccessibilityOptions;
