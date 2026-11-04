import type { EventSearchFilters } from './types/filterTypes';
import {
  formatFinnishDateToIso,
  formatIsoDateToFinnish,
  parseFilterStartDate,
} from './searchDateUtils';

export type FilterOptionsContext = {
  themePaths?: string[];
  accessibility?: string[];
  languages?: string[];
};

export type FilterUrlConfig<T> = {
  /** Canonical URL parameter name. */
  paramName: string;
  /** Legacy or alternate URL parameter aliases. */
  aliases?: readonly string[];
  /** Default empty/inactive value. */
  defaultValue: T;
  /** Checks whether a value is considered active. */
  isActive: (value: T) => boolean;
  /** Parses and sanitizes the filter value from URLSearchParams. */
  parseFromUrl: (
    params: URLSearchParams,
    optionsContext?: FilterOptionsContext
  ) => T;
  /** Serializes the filter value into URLSearchParams. */
  writeToUrl: (params: URLSearchParams, value: T) => void;
};

/**
 * Extracts comma-separated or repeated parameter values from URLSearchParams.
 */
export const extractUrlParamValues = (
  searchParams: URLSearchParams,
  keys: readonly string[]
): string[] => {
  const raw: string[] = [];
  for (const key of keys) {
    for (const val of searchParams.getAll(key)) {
      for (const part of val.split(',')) {
        const trimmed = part.trim();
        if (trimmed) raw.push(trimmed);
      }
    }
  }
  return Array.from(new Set(raw));
};

/**
 * Strategy map for URL parsing, serialization, and default states for each search filter category.
 * Enforces compile-time completeness over `keyof EventSearchFilters`.
 */
export const FILTER_URL_CONFIG: {
  [K in keyof EventSearchFilters]: FilterUrlConfig<EventSearchFilters[K]>;
} = {
  themePaths: {
    paramName: 'themePath',
    aliases: ['themePaths'],
    defaultValue: [],
    isActive: (v) => v.length > 0,
    parseFromUrl: (params, ctx) => {
      const raw = extractUrlParamValues(params, ['themePath', 'themePaths']);
      if (!ctx?.themePaths) return raw;
      const allowed = new Set(ctx.themePaths);
      return raw.filter((slug) => allowed.has(slug));
    },
    writeToUrl: (params, values) => {
      params.delete('themePath');
      params.delete('themePaths');
      for (const slug of values) {
        params.append('themePath', slug);
      }
    },
  },

  startDate: {
    paramName: 'startDate',
    aliases: ['date'],
    defaultValue: '',
    isActive: (v) => v.trim().length > 0,
    parseFromUrl: (params) => {
      const rawDate = params.get('startDate') || params.get('date');
      const parsedDate = parseFilterStartDate(rawDate);
      return parsedDate ? formatIsoDateToFinnish(rawDate) : '';
    },
    writeToUrl: (params, value) => {
      params.delete('startDate');
      params.delete('date');
      if (value) {
        const isoDate = formatFinnishDateToIso(value);
        if (isoDate) {
          params.set('startDate', isoDate);
        }
      }
    },
  },

  accessibility: {
    paramName: 'accessibility',
    defaultValue: [],
    isActive: (v) => v.length > 0,
    parseFromUrl: (params, ctx) => {
      const raw = extractUrlParamValues(params, ['accessibility']);
      if (!ctx?.accessibility) return raw;
      const allowed = new Set(ctx.accessibility);
      return raw.filter((item) => allowed.has(item));
    },
    writeToUrl: (params, values) => {
      params.delete('accessibility');
      for (const acc of values) {
        params.append('accessibility', acc);
      }
    },
  },

  languages: {
    paramName: 'language',
    aliases: ['languages'],
    defaultValue: [],
    isActive: (v) => v.length > 0,
    parseFromUrl: (params, ctx) => {
      const raw = extractUrlParamValues(params, ['language', 'languages']).map(
        (l) => l.toLowerCase()
      );
      if (!ctx?.languages) return raw;
      const allowed = new Set(ctx.languages.map((l) => l.toLowerCase()));
      return raw.filter((lang) => allowed.has(lang));
    },
    writeToUrl: (params, values) => {
      params.delete('language');
      params.delete('languages');
      for (const lang of values) {
        params.append('language', lang.toLowerCase());
      }
    },
  },

  availableOnly: {
    paramName: 'availableOnly',
    defaultValue: false,
    isActive: Boolean,
    parseFromUrl: (params) => params.get('availableOnly') === 'true',
    writeToUrl: (params, value) => {
      params.delete('availableOnly');
      if (value) {
        params.set('availableOnly', 'true');
      }
    },
  },

  familyOnly: {
    paramName: 'familyOnly',
    defaultValue: false,
    isActive: Boolean,
    parseFromUrl: (params) => params.get('familyOnly') === 'true',
    writeToUrl: (params, value) => {
      params.delete('familyOnly');
      if (value) {
        params.set('familyOnly', 'true');
      }
    },
  },
};

/**
 * List of all query parameter names that affect search filters and child selection.
 * Automatically derived from `FILTER_URL_CONFIG` plus guardian child selectors.
 */
export const SEARCH_URL_PARAMS: readonly string[] = [
  'child',
  'childId',
  ...Object.values(FILTER_URL_CONFIG).flatMap((cfg) => [
    cfg.paramName,
    ...(cfg.aliases ?? []),
  ]),
];
