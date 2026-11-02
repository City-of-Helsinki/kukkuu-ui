import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';

import {
  EventSearchUrlContext,
  type EventSearchUrlContextType,
} from '../../context/EventSearchUrlContext';
import { DEFAULT_SEARCH_FILTERS } from '../../eventSearchUtils';
import type { EventSearchFilters } from '../../types/filterTypes';
import { useSearchDraftSync } from '../useSearchDraftSync';

describe('useSearchDraftSync', () => {
  const createUrlContextValue = (
    overrides: Partial<EventSearchUrlContextType> = {}
  ): EventSearchUrlContextType => ({
    activeChildId: 'child-1',
    committedFilters: DEFAULT_SEARCH_FILTERS,
    hasChildren: true,
    commitSearchToUrl: vi.fn(),
    ...overrides,
  });

  it('initializes draftChildId and draftFilters from EventSearchUrlContext', () => {
    const initialFilters: EventSearchFilters = {
      ...DEFAULT_SEARCH_FILTERS,
      themePaths: ['rytmi'],
      availableOnly: true,
    };
    const contextValue = createUrlContextValue({
      activeChildId: 'child-1',
      committedFilters: initialFilters,
    });

    const { result } = renderHook(() => useSearchDraftSync(), {
      wrapper: ({ children }) => (
        <EventSearchUrlContext.Provider value={contextValue}>
          {children}
        </EventSearchUrlContext.Provider>
      ),
    });

    expect(result.current.draftChildId).toBe('child-1');
    expect(result.current.draftFilters).toEqual(initialFilters);
    expect(result.current.committedFilters).toEqual(initialFilters);
  });

  it('defaults draftChildId to empty string when activeChildId is undefined', () => {
    const contextValue = createUrlContextValue({ activeChildId: undefined });

    const { result } = renderHook(() => useSearchDraftSync(), {
      wrapper: ({ children }) => (
        <EventSearchUrlContext.Provider value={contextValue}>
          {children}
        </EventSearchUrlContext.Provider>
      ),
    });

    expect(result.current.draftChildId).toBe('');
  });

  it('synchronizes draft state when URL context values change externally', () => {
    let contextValue = createUrlContextValue();

    const { result, rerender } = renderHook(() => useSearchDraftSync(), {
      wrapper: ({ children }) => (
        <EventSearchUrlContext.Provider value={contextValue}>
          {children}
        </EventSearchUrlContext.Provider>
      ),
    });

    act(() => {
      result.current.setDraftChildId('child-draft');
      result.current.updateDraftFilter('startDate', '25.11.2026');
    });
    expect(result.current.draftChildId).toBe('child-draft');
    expect(result.current.draftFilters.startDate).toBe('25.11.2026');

    const nextCommitted: EventSearchFilters = {
      ...DEFAULT_SEARCH_FILTERS,
      languages: ['sv'],
    };
    contextValue = createUrlContextValue({
      activeChildId: 'child-2',
      committedFilters: nextCommitted,
    });
    rerender();

    expect(result.current.draftChildId).toBe('child-2');
    expect(result.current.draftFilters).toEqual(nextCommitted);

    // Passing undefined activeChildId preserves current draftChildId
    contextValue = createUrlContextValue({
      activeChildId: undefined,
      committedFilters: nextCommitted,
    });
    rerender();

    expect(result.current.draftChildId).toBe('child-2');
  });

  it('updates draftFilters locally via updateDraftFilter and commits only on submitSearch', () => {
    const commitSearchToUrl = vi.fn();
    const contextValue = createUrlContextValue({ commitSearchToUrl });

    const { result } = renderHook(() => useSearchDraftSync(), {
      wrapper: ({ children }) => (
        <EventSearchUrlContext.Provider value={contextValue}>
          {children}
        </EventSearchUrlContext.Provider>
      ),
    });

    act(() => {
      result.current.setDraftChildId('child-2');
      result.current.updateDraftFilter('themePaths', ['tarina']);
      result.current.updateDraftFilter('familyOnly', true);
    });

    expect(commitSearchToUrl).not.toHaveBeenCalled();

    const preventDefault = vi.fn();
    act(() => {
      result.current.submitSearch({
        preventDefault,
      } as unknown as React.FormEvent);
    });

    expect(preventDefault).toHaveBeenCalledOnce();
    expect(commitSearchToUrl).toHaveBeenCalledWith('child-2', {
      ...DEFAULT_SEARCH_FILTERS,
      themePaths: ['tarina'],
      familyOnly: true,
    });
  });

  it('commits immediately on applyThemePathFilter and clearAllFilters and refocuses submitButtonRef', () => {
    vi.useFakeTimers();
    const commitSearchToUrl = vi.fn();
    const contextValue = createUrlContextValue({
      activeChildId: 'child-1',
      committedFilters: {
        ...DEFAULT_SEARCH_FILTERS,
        availableOnly: true,
      },
      commitSearchToUrl,
    });

    const { result } = renderHook(() => useSearchDraftSync(), {
      wrapper: ({ children }) => (
        <EventSearchUrlContext.Provider value={contextValue}>
          {children}
        </EventSearchUrlContext.Provider>
      ),
    });

    const mockButton = document.createElement('button');
    const focusSpy = vi.spyOn(mockButton, 'focus');
    (
      result.current
        .submitButtonRef as React.MutableRefObject<HTMLButtonElement | null>
    ).current = mockButton;

    act(() => {
      result.current.applyThemePathFilter('jalki');
    });

    expect(result.current.draftFilters.themePaths).toEqual(['jalki']);
    expect(commitSearchToUrl).toHaveBeenCalledWith('child-1', {
      ...DEFAULT_SEARCH_FILTERS,
      availableOnly: true,
      themePaths: ['jalki'],
    });

    act(() => {
      result.current.clearAllFilters();
      vi.runAllTimers();
    });

    expect(result.current.draftFilters).toEqual(DEFAULT_SEARCH_FILTERS);
    expect(commitSearchToUrl).toHaveBeenLastCalledWith(
      'child-1',
      DEFAULT_SEARCH_FILTERS
    );
    expect(focusSpy).toHaveBeenCalledOnce();
    vi.useRealTimers();
  });
});
