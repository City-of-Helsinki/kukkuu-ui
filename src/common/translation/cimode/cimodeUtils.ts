import i18n from 'i18next';

export const CIMODE_STORAGE_KEY = 'kukkuu_cimode';
export const CIMODE_INDICATOR_STORAGE_KEY = 'kukkuu_cimode_indicator_requested';
export const CIMODE_SEARCH_PARAM = 'cimode';
export const CIMODE_CHANGE_EVENT = 'kukkuu_cimode_change';
export const CIMODE_INDICATOR_ELEMENT_ID = 'cimode-indicator-widget';

const notifyCimodeChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(CIMODE_CHANGE_EVENT));
  }
  if (i18n.isInitialized) {
    i18n.emit('languageChanged', i18n.language);
  }
};

/**
 * Parses search query string and determines if CIMODE is explicitly requested or disabled.
 * Returns true if enabled (?cimode, ?cimode=true, ?cimode=1),
 * false if explicitly disabled (?cimode=false, ?cimode=0, ?cimode=off),
 * or null if not specified in search parameters.
 */
export const getCimodeParamState = (search: string): boolean | null => {
  if (!search) return null;
  const params = new URLSearchParams(search);
  if (!params.has(CIMODE_SEARCH_PARAM)) return null;

  const value = (params.get(CIMODE_SEARCH_PARAM) ?? '').toLowerCase();
  if (['false', '0', 'off'].includes(value)) {
    return false;
  }
  return true;
};

/**
 * Checks whether CIMODE translation mode is currently active.
 */
export const isCimodeActive = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    return window.sessionStorage.getItem(CIMODE_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
};

/**
 * Checks whether the bottom-right CIMODE indicator widget is requested/visible.
 * Returns true if explicitly requested in sessionStorage or if CIMODE is currently active.
 */
export const isCimodeIndicatorRequested = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    return (
      window.sessionStorage.getItem(CIMODE_INDICATOR_STORAGE_KEY) === 'true' ||
      isCimodeActive()
    );
  } catch {
    return false;
  }
};

/**
 * Requests or hides the bottom-right CIMODE indicator widget in sessionStorage.
 */
export const setCimodeIndicatorRequested = (requested: boolean): void => {
  if (typeof window === 'undefined') return;
  try {
    if (requested) {
      window.sessionStorage.setItem(CIMODE_INDICATOR_STORAGE_KEY, 'true');
    } else {
      window.sessionStorage.removeItem(CIMODE_INDICATOR_STORAGE_KEY);
      if (isCimodeActive()) {
        window.sessionStorage.removeItem(CIMODE_STORAGE_KEY);
      }
    }
  } catch {
    // Ignore storage quota or access issues
  }
  notifyCimodeChange();
};

/**
 * Enables or disables CIMODE in sessionStorage and notifies i18next listeners
 * to trigger a re-render of components using useTranslation.
 */
export const setCimodeActive = (active: boolean): void => {
  if (typeof window === 'undefined') return;
  try {
    if (active) {
      window.sessionStorage.setItem(CIMODE_STORAGE_KEY, 'true');
      window.sessionStorage.setItem(CIMODE_INDICATOR_STORAGE_KEY, 'true');
    } else {
      window.sessionStorage.removeItem(CIMODE_STORAGE_KEY);
    }
  } catch {
    // Ignore storage quota or access issues
  }
  notifyCimodeChange();
};

/**
 * Syncs CIMODE state from URL search parameters, updating sessionStorage if present.
 */
export const syncCimodeFromLocation = (search: string): boolean => {
  const paramState = getCimodeParamState(search);
  if (paramState === true && !isCimodeActive()) {
    setCimodeActive(true);
    return true;
  }
  if (
    paramState === false &&
    (isCimodeActive() || isCimodeIndicatorRequested())
  ) {
    setCimodeActive(false);
    setCimodeIndicatorRequested(false);
    return false;
  }
  return isCimodeActive();
};

/**
 * Initializes CIMODE state during application bootstrapping.
 */
export const initializeCimodeFromUrl = (): void => {
  if (typeof window === 'undefined') return;
  syncCimodeFromLocation(window.location.search);
};
