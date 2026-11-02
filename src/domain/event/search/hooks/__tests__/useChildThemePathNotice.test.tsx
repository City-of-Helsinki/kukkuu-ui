import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';

import { useChildThemePathNotice } from '../useChildThemePathNotice';
import {
  EventSearchUrlContext,
  type EventSearchUrlContextType,
} from '../../context/EventSearchUrlContext';

describe('useChildThemePathNotice', () => {
  const themePath = { slug: 'rytmi', name: 'Rytmi' };

  const createWrapper = (activeChildId?: string, themePaths: string[] = []) => {
    return ({ children }: { children: React.ReactNode }) => (
      <EventSearchUrlContext.Provider
        value={
          {
            activeChildId,
            committedFilters: { themePaths },
            hasChildren: Boolean(activeChildId),
            commitSearchToUrl: vi.fn(),
          } as unknown as EventSearchUrlContextType
        }
      >
        {children}
      </EventSearchUrlContext.Provider>
    );
  };

  it('returns visibleChildThemePath when theme path is present and not filtered or dismissed', () => {
    const { result } = renderHook(() => useChildThemePathNotice(themePath), {
      wrapper: createWrapper('child-1', []),
    });
    expect(result.current.visibleChildThemePath).toEqual(themePath);
  });

  it('hides notice when the theme path is already active in search filters', () => {
    const { result } = renderHook(() => useChildThemePathNotice(themePath), {
      wrapper: createWrapper('child-1', ['rytmi']),
    });
    expect(result.current.visibleChildThemePath).toBeNull();
  });

  it('hides notice and updates state when dismissed', () => {
    const { result } = renderHook(() => useChildThemePathNotice(themePath), {
      wrapper: createWrapper('child-1', []),
    });

    expect(result.current.visibleChildThemePath).toEqual(themePath);

    act(() => {
      result.current.dismissThemePathNotice();
    });

    expect(result.current.visibleChildThemePath).toBeNull();
  });

  it('returns null when themePath is missing or child has no slug', () => {
    const { result: noTheme } = renderHook(
      () => useChildThemePathNotice(null),
      { wrapper: createWrapper('child-1') }
    );
    expect(noTheme.current.visibleChildThemePath).toBeNull();

    const { result: noSlug } = renderHook(
      () => useChildThemePathNotice({ slug: '', name: 'Empty' }),
      { wrapper: createWrapper('child-1') }
    );
    expect(noSlug.current.visibleChildThemePath).toBeNull();
  });

  it('returns null when activeChildId is missing', () => {
    const { result } = renderHook(() => useChildThemePathNotice(themePath), {
      wrapper: createWrapper(undefined),
    });
    expect(result.current.visibleChildThemePath).toBeNull();
  });
});
