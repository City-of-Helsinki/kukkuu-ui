export type FilterOption = {
  label: string;
  value: string;
};

export type FilterOptionsHookResult = {
  options: FilterOption[];
  loading: boolean;
};

export type EventSearchFilters = {
  themePaths: string[];
  startDate: string; // 'DD.MM.YYYY' in form draft, serialized as 'YYYY-MM-DD' in URL
  accessibility: string[];
  languages: string[];
  availableOnly: boolean;
  familyOnly: boolean;
};

/**
 * Canonical list of all search filter categories in `EventSearchFilters`.
 * Enforces completeness over `keyof EventSearchFilters` at compile time.
 */
export const EVENT_SEARCH_FILTER_KEYS = [
  'themePaths',
  'startDate',
  'accessibility',
  'languages',
  'availableOnly',
  'familyOnly',
] as const satisfies readonly (keyof EventSearchFilters)[];

export type EventSearchFilterKey = (typeof EVENT_SEARCH_FILTER_KEYS)[number];

export type FilterBadgeItem = {
  id: string;
  category: keyof EventSearchFilters;
  value: string;
  label: string;
};
