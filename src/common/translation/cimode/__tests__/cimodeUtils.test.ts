import { describe, it, expect, beforeEach, vi } from 'vitest';
import i18n from 'i18next';

import {
  getCimodeParamState,
  isCimodeActive,
  setCimodeActive,
  isCimodeIndicatorRequested,
  setCimodeIndicatorRequested,
  syncCimodeFromLocation,
  CIMODE_STORAGE_KEY,
  CIMODE_INDICATOR_STORAGE_KEY,
  CIMODE_CHANGE_EVENT,
} from '../cimodeUtils';

describe('cimodeUtils', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    vi.restoreAllMocks();
  });

  describe('getCimodeParamState', () => {
    it('returns true when cimode param is present without value or truthy', () => {
      expect(getCimodeParamState('?cimode')).toBe(true);
      expect(getCimodeParamState('?cimode=true')).toBe(true);
      expect(getCimodeParamState('?cimode=1')).toBe(true);
      expect(getCimodeParamState('?foo=bar&cimode=TRUE')).toBe(true);
    });

    it('returns false when cimode param is explicitly falsy', () => {
      expect(getCimodeParamState('?cimode=false')).toBe(false);
      expect(getCimodeParamState('?cimode=0')).toBe(false);
      expect(getCimodeParamState('?cimode=off')).toBe(false);
      expect(getCimodeParamState('?foo=bar&cimode=FALSE')).toBe(false);
    });

    it('returns null when cimode param is missing', () => {
      expect(getCimodeParamState('')).toBeNull();
      expect(getCimodeParamState('?foo=bar')).toBeNull();
    });
  });

  describe('isCimodeActive & setCimodeActive', () => {
    it('defaults to false when sessionStorage is empty', () => {
      expect(isCimodeActive()).toBe(false);
      expect(isCimodeIndicatorRequested()).toBe(false);
    });

    it('sets and removes item from sessionStorage', () => {
      setCimodeActive(true);
      expect(window.sessionStorage.getItem(CIMODE_STORAGE_KEY)).toBe('true');
      expect(
        window.sessionStorage.getItem(CIMODE_INDICATOR_STORAGE_KEY)
      ).toBe('true');
      expect(isCimodeActive()).toBe(true);
      expect(isCimodeIndicatorRequested()).toBe(true);

      setCimodeActive(false);
      expect(window.sessionStorage.getItem(CIMODE_STORAGE_KEY)).toBeNull();
      expect(isCimodeActive()).toBe(false);
    });

    it('emits languageChanged on i18n and dispatches CIMODE_CHANGE_EVENT', () => {
      const emitSpy = vi.spyOn(i18n, 'emit');
      const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

      setCimodeActive(true);

      expect(emitSpy).toHaveBeenCalledWith('languageChanged', i18n.language);
      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({ type: CIMODE_CHANGE_EVENT })
      );
    });
  });

  describe('isCimodeIndicatorRequested & setCimodeIndicatorRequested', () => {
    it('allows requesting indicator without activating CIMODE', () => {
      setCimodeIndicatorRequested(true);
      expect(isCimodeIndicatorRequested()).toBe(true);
      expect(isCimodeActive()).toBe(false);
      expect(
        window.sessionStorage.getItem(CIMODE_INDICATOR_STORAGE_KEY)
      ).toBe('true');
      expect(window.sessionStorage.getItem(CIMODE_STORAGE_KEY)).toBeNull();

      setCimodeIndicatorRequested(false);
      expect(isCimodeIndicatorRequested()).toBe(false);
      expect(
        window.sessionStorage.getItem(CIMODE_INDICATOR_STORAGE_KEY)
      ).toBeNull();
    });

    it('deactivates CIMODE when indicator is closed while CIMODE is active', () => {
      setCimodeActive(true);
      expect(isCimodeActive()).toBe(true);

      setCimodeIndicatorRequested(false);
      expect(isCimodeIndicatorRequested()).toBe(false);
      expect(isCimodeActive()).toBe(false);
    });
  });

  describe('syncCimodeFromLocation', () => {
    it('activates when search contains ?cimode=true', () => {
      const active = syncCimodeFromLocation('?cimode=true');
      expect(active).toBe(true);
      expect(isCimodeActive()).toBe(true);
      expect(isCimodeIndicatorRequested()).toBe(true);
    });

    it('deactivates when search contains ?cimode=false', () => {
      setCimodeActive(true);
      const active = syncCimodeFromLocation('?cimode=false');
      expect(active).toBe(false);
      expect(isCimodeActive()).toBe(false);
      expect(isCimodeIndicatorRequested()).toBe(false);
    });

    it('preserves existing active state if no cimode param in search', () => {
      setCimodeActive(true);
      const active = syncCimodeFromLocation('?other=value');
      expect(active).toBe(true);
      expect(isCimodeActive()).toBe(true);
    });
  });
});
