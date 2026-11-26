import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

export const SPEECHLESS_LANGUAGE = 'sanaton';

/**
 * Standard ISO 639-2 / ISO 639-3 code for "no linguistic content; not applicable",
 * used to represent speechless / non-verbal event occurrences.
 */
export const SPEECHLESS_LANGUAGE_CODE = 'zxx';

/**
 * Checks whether a single language string represents a speechless (non-verbal) performance
 * using either the standard ISO 639-2/639-3 code ("zxx") or "sanaton".
 */
export const isSpeechlessLanguageCode = (lang: string): boolean => {
  const normalized = lang.trim().toLowerCase();
  return (
    normalized === SPEECHLESS_LANGUAGE_CODE ||
    normalized === SPEECHLESS_LANGUAGE
  );
};

export type OccurrenceLanguageNode = {
  alpha3Code: string;
  name?: string | null;
};

export type OccurrenceAccessibilityNode = {
  id?: string | null;
  slug: string;
  name?: string | null;
  sortOrder?: number | null;
};

export type NormalizedOccurrenceAccessibility = {
  slug: string;
  name: string;
  sortOrder: number | null;
};

export type OccurrenceFeatureSource = {
  languages?: Array<OccurrenceLanguageNode | null> | null;
  accessibilities?: Array<OccurrenceAccessibilityNode | null> | null;
};

/**
 * Comparator matching backend `Tag.Meta.ordering = ["sort_order", "slug"]`,
 * placing entries without a `sortOrder` last.
 */
export const compareAccessibilities = (
  a: { sortOrder: number | null; slug: string },
  b: { sortOrder: number | null; slug: string }
): number => {
  if (a.sortOrder != null && b.sortOrder != null) {
    if (a.sortOrder !== b.sortOrder) {
      return a.sortOrder - b.sortOrder;
    }
  } else if (a.sortOrder != null) {
    return -1;
  } else if (b.sortOrder != null) {
    return 1;
  }
  return a.slug.localeCompare(b.slug);
};

/**
 * Returns the ISO 639-3 language codes configured for an occurrence.
 */
export const getOccurrenceLanguages = (
  occurrence?: OccurrenceFeatureSource | null
): string[] => {
  if (!occurrence?.languages) return [];
  return occurrence.languages
    .map((lang) => lang?.alpha3Code?.trim())
    .filter((code): code is string => Boolean(code));
};

/**
 * Returns deduplicated, sorted accessibility nodes configured for an occurrence.
 */
export const getOccurrenceAccessibilityNodes = (
  occurrence?: OccurrenceFeatureSource | null
): NormalizedOccurrenceAccessibility[] => {
  if (!occurrence?.accessibilities) {
    return [];
  }

  const bySlug = new Map<string, NormalizedOccurrenceAccessibility>();
  for (const acc of occurrence.accessibilities) {
    const slug = acc?.slug?.trim();
    if (!slug || bySlug.has(slug)) continue;
    const name = acc?.name?.trim() || slug;
    const sortOrder = acc?.sortOrder ?? null;
    bySlug.set(slug, { slug, name, sortOrder });
  }

  return Array.from(bySlug.values()).sort(compareAccessibilities);
};

/**
 * Returns localized accessibility labels configured for an occurrence,
 * sorted by backend `sortOrder` (nulls last) then `slug`.
 */
export const getOccurrenceAccessibilities = (
  occurrence?: OccurrenceFeatureSource | null
): string[] => {
  return getOccurrenceAccessibilityNodes(occurrence).map((acc) => acc.name);
};

/**
 * Checks whether an occurrence includes "zxx" (ISO 639-2/639-3 speechless code)
 * or "sanaton" (speechless/non-verbal) in its languages.
 */
export const isSpeechless = (languages: string[]): boolean => {
  return languages.some(isSpeechlessLanguageCode);
};

/**
 * Formats a list of languages into a comma-separated localized string.
 */
export const formatOccurrenceLanguages = (
  languages: string[],
  t: TFunction,
  languageNames?: Map<string, string>
): string => {
  if (languages.length === 0) return '–';
  return languages
    .map((lang) => {
      const normalized = lang.toLowerCase();
      const key = `common.language.${normalized}`;
      return t(key, languageNames?.get(normalized) ?? lang);
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

  const languageNames = useMemo(() => {
    const names = new Map<string, string>();
    for (const lang of occurrence?.languages ?? []) {
      if (lang?.alpha3Code && lang.name) {
        names.set(lang.alpha3Code.toLowerCase(), lang.name);
      }
    }
    return names;
  }, [occurrence?.languages]);

  const accessibilities = useMemo(
    () => getOccurrenceAccessibilities(occurrence),
    [occurrence]
  );

  const speechless = useMemo(
    () => isSpeechless(languages),
    [languages]
  );

  const languageText = useMemo(
    () => formatOccurrenceLanguages(languages, t, languageNames),
    [languages, t, languageNames]
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
