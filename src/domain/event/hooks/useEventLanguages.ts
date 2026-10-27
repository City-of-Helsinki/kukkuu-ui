import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { extractUniqueLanguages } from '../EventUtils';

/**
 * Hook to retrieve unique language codes and their comma-separated localized string representation
 * for an event or selected occurrence.
 *
 * @param selectedOccurrence - Currently selected occurrence, if any.
 * @param occurrences - List of all event occurrences.
 * @returns An object containing `uniqueLanguages` array and `languageText` string or null.
 */
export function useEventLanguages<
  O extends { occurrenceLanguage?: string | null }
>(selectedOccurrence?: O | null, occurrences: O[] = []) {
  const { t } = useTranslation();

  const uniqueLanguages = useMemo(
    () => extractUniqueLanguages(selectedOccurrence, occurrences),
    [selectedOccurrence, occurrences]
  );

  const languageText = useMemo(() => {
    if (uniqueLanguages.length === 0) return null;
    return uniqueLanguages
      .map((lang) => t(`common.language.${lang}`, lang))
      .join(', ');
  }, [uniqueLanguages, t]);

  return { uniqueLanguages, languageText };
}

export default useEventLanguages;

