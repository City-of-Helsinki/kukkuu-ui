import React from 'react';
import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router';

import { useSearchUrlParamsSync } from '../useSearchUrlParamsSync';

describe('useSearchUrlParamsSync', () => {
  const createWrapper =
    (initialEntries: string[] = ['/events?child=child-1&themePath=rytmi']) =>
    ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    );

  it('parses committedFilters from initial URL search params', () => {
    const { result } = renderHook(() => useSearchUrlParamsSync(), {
      wrapper: createWrapper([
        '/events?child=child-1&themePath=rytmi&startDate=2026-11-25&availableOnly=true',
      ]),
    });

    expect(result.current.committedFilters.themePaths).toEqual(['rytmi']);
    expect(result.current.committedFilters.startDate).toBe('25.11.2026');
    expect(result.current.committedFilters.availableOnly).toBe(true);
  });

  it('writes search filters and child ID to URL when commitSearchToUrl is called', () => {
    let currentLocation: any;
    const TestComponent = () => {
      const sync = useSearchUrlParamsSync();
      const location = useLocation();
      currentLocation = location;
      return sync;
    };

    const { result } = renderHook(() => TestComponent(), {
      wrapper: createWrapper(['/events']),
    });

    act(() => {
      result.current.commitSearchToUrl('child-2', {
        themePaths: ['tarina'],
        startDate: '10.12.2026',
        accessibility: ['sensory'],
        languages: ['fi'],
        availableOnly: true,
        familyOnly: true,
      });
    });

    expect(currentLocation.search).toContain('child=child-2');
    expect(currentLocation.search).toContain('themePath=tarina');
    expect(currentLocation.search).toContain('startDate=2026-12-10');
    expect(currentLocation.search).toContain('availableOnly=true');
    expect(currentLocation.search).toContain('familyOnly=true');
  });
});
