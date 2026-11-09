import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

export const SPEECHLESS_LANGUAGE = 'sanaton';

export type OccurrenceFeatureSource = {
  occurrenceLanguage?: string | null;
  accessibilities?: string[] | null;
};

/**
 * Returns the languages configured for an occurrence.
 *
 * TODO(backend): Refactor to use the official occurrence languages field
 * once multi-language support lands in the GraphQL API.
 */
export const getOccurrenceLanguages = (
  occurrence?: OccurrenceFeatureSource | null
): string[] => {
  if (!occurrence || !occurrence.occurrenceLanguage) return [];
  // Split comma-separated string if multiple languages are provided
  return occurrence.occurrenceLanguage
    .split(',')
    .map((lang) => lang.trim())
    .filter(Boolean);
};

/**
 * Returns the accessibilities configured for an occurrence.
 *
 * TODO(backend): Refactor to use the official occurrence accessibilities field
 * once accessibilities support lands in the GraphQL API.
 */
export const getOccurrenceAccessibilities = (
  occurrence?: OccurrenceFeatureSource | null
): string[] => {
  if (!occurrence || !occurrence.accessibilities) {
    return [];
  }
  return occurrence.accessibilities;
};

/**
 * Checks whether an occurrence includes "sanaton" (speechless/non-verbal) in its languages.
 */
export const isSpeechless = (languages: string[]): boolean => {
  return languages.some(
    (lang) => lang.trim().toLowerCase() === SPEECHLESS_LANGUAGE
  );
};

/**
 * Formats a list of languages into a comma-separated localized string.
 */
export const formatOccurrenceLanguages = (
  languages: string[],
  t: TFunction
): string => {
  if (languages.length === 0) return '–';
  return languages
    .map((lang) => {
      const key = `common.language.${lang.toLowerCase()}`;
      return t(key, lang);
    })
    .join(', ');
};

/**
 * Hook to retrieve resolved languages, accessibilities, and speechless flag for an occurrence.
 */
export function useOccurrenceFeatures(
  occurrence?: OccurrenceFeatureSource | null
) {
  const { t } = useTranslation();

  const languages = useMemo(
    () => getOccurrenceLanguages(occurrence),
    [occurrence]
  );

  const accessibilities = useMemo(
    () => getOccurrenceAccessibilities(occurrence),
    [occurrence]
  );

  const speechless = useMemo(
    () => isSpeechless(languages),
    [languages]
  );

  const languageText = useMemo(
    () => formatOccurrenceLanguages(languages, t),
    [languages, t]
  );

  return {
    languages,
    languageText,
    accessibilities,
    hasAccessibilities: accessibilities.length > 0,
    isSpeechless: speechless,
  };
}

export default useOccurrenceFeatures;
