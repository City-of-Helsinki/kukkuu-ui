import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import useQuery from '../../../api/useQuery';
import RelayList from '../../../api/relayList';
import type {
  OccurrenceLanguageFieldsFragment,
  OccurrenceLanguagesQuery,
} from '../../../api/generatedTypes/graphql';
import { getCurrentLanguage } from '../../../../common/translation/TranslationUtils';
import { occurrenceLanguagesQuery } from '../../queries/occurrenceLanguagesQuery';
import type {
  FilterOption,
  FilterOptionsHookResult,
} from '../types/filterTypes';

const OccurrenceLanguageList = RelayList<OccurrenceLanguageFieldsFragment>();

/**
 * Dedicated hook returning available options for the "Kieli" (Language) filter.
 * Fetches languages selectable for occurrences (`canBeOccurrenceLanguage: true`)
 * using ISO 639-3 alpha-3 codes matching `events(languages: [String])`.
 */
export function useOccurrenceLanguageOptions(): FilterOptionsHookResult {
  const { i18n } = useTranslation();
  const currentLanguage = getCurrentLanguage(i18n);
  const previousLanguageRef = useRef(currentLanguage);

  const { data, loading, refetch } = useQuery<OccurrenceLanguagesQuery>(
    occurrenceLanguagesQuery,
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
      OccurrenceLanguageList(data?.languages)
        .items.filter((node) => Boolean(node.alpha3Code))
        .map((node) => ({
          value: node.alpha3Code.toLowerCase(),
          label: node.name || node.alpha3Code,
        })),
    [data?.languages]
  );

  return { options, loading };
}

export default useOccurrenceLanguageOptions;
