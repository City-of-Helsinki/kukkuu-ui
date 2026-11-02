import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

import {
  EVENT_SEARCH_FILTER_KEYS,
  type EventSearchFilters,
  type FilterBadgeItem,
} from '../types/filterTypes';

/** Props for the `useActiveBadges` hook. */
export type UseActiveBadgesParams = {
  filter: EventSearchFilters;
  themePathOptions: Array<{ label: string; value: string }>;
  accessibilityOptions: Array<{ label: string; value: string }>;
  languageOptions: Array<{ label: string; value: string }>;
  t?: TFunction;
};

/** Options returned by the `useActiveBadges` hook. */
export type UseActiveBadgesResult = {
  badges: FilterBadgeItem[];
};

/** Context passed to badge generators for resolving option labels and translations. */
export type BadgeGeneratorContext = {
  themePathOptions: Array<{ label: string; value: string }>;
  accessibilityOptions: Array<{ label: string; value: string }>;
  languageOptions: Array<{ label: string; value: string }>;
  t: TFunction;
};

/** Function signature for generating badge items for a single filter category. */
export type BadgeGenerator<K extends keyof EventSearchFilters> = (
  value: EventSearchFilters[K],
  context: BadgeGeneratorContext
) => FilterBadgeItem[];

/**
 * Strategy map for generating badges for each filter category.
 * Enforces completeness over `keyof EventSearchFilters` at compile time.
 */
export const BADGE_GENERATORS: {
  [K in keyof EventSearchFilters]: BadgeGenerator<K>;
} = {
  themePaths: (slugs, { themePathOptions }) =>
    slugs.map((slug) => {
      const option = themePathOptions.find((opt) => opt.value === slug);
      return {
        id: `themePath-${slug}`,
        category: 'themePaths',
        value: slug,
        label: option?.label ?? slug,
      };
    }),

  startDate: (date, { t }) =>
    date
      ? [
          {
            id: `startDate-${date}`,
            category: 'startDate',
            value: date,
            label: t('search.filter.dateFilterBadge', { date }),
          },
        ]
      : [],

  accessibility: (accList, { accessibilityOptions }) =>
    accList.map((acc) => {
      const option = accessibilityOptions.find((opt) => opt.value === acc);
      return {
        id: `accessibility-${acc}`,
        category: 'accessibility',
        value: acc,
        label: option?.label ?? acc,
      };
    }),

  languages: (langList, { languageOptions }) =>
    langList.map((lang) => {
      const option = languageOptions.find((opt) => opt.value === lang);
      return {
        id: `language-${lang}`,
        category: 'languages',
        value: lang,
        label: option?.label ?? lang,
      };
    }),

  availableOnly: (availableOnly, { t }) =>
    availableOnly
      ? [
          {
            id: 'availableOnly-true',
            category: 'availableOnly',
            value: 'true',
            label: t('search.filter.availableOnlyLabel'),
          },
        ]
      : [],

  familyOnly: (familyOnly, { t }) =>
    familyOnly
      ? [
          {
            id: 'familyOnly-true',
            category: 'familyOnly',
            value: 'true',
            label: t('search.filter.familyOnlyLabel'),
          },
        ]
      : [],
};

/**
 * Builds a memoized list of filter badges from draft filters,
 * theme/path/accessibility/language options, and translation function.
 *
 * Utilizes `BADGE_GENERATORS` to enforce exhaustive category handling at compile time.
 *
 * @param params.filter - Draft filter values.
 * @param params.themePathOptions - Available theme path options.
 * @param params.accessibilityOptions - Available accessibility options.
 * @param params.languageOptions - Available language options.
 * @param params.t - Optional translation function from `react-i18next` (defaults to `useTranslation`).
 * @returns Memoized array of `FilterBadgeItem`.
 */
export function useActiveBadges({
  filter,
  themePathOptions,
  accessibilityOptions,
  languageOptions,
  t: customT,
}: UseActiveBadgesParams): UseActiveBadgesResult {
  const { t: hookT } = useTranslation();
  const t = customT || hookT;

  const context = useMemo<BadgeGeneratorContext>(
    () => ({
      themePathOptions,
      accessibilityOptions,
      languageOptions,
      t,
    }),
    [themePathOptions, accessibilityOptions, languageOptions, t]
  );

  const badges = useMemo<FilterBadgeItem[]>(() => {
    return EVENT_SEARCH_FILTER_KEYS.flatMap((category) => {
      const generator = BADGE_GENERATORS[category];
      return generator(filter[category] as never, context);
    });
  }, [filter, context]);

  return { badges };
}

export default useActiveBadges;
