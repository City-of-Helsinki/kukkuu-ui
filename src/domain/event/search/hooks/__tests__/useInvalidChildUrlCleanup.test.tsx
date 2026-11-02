import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { MemoryRouter, useSearchParams } from 'react-router';
import { toast } from 'react-toastify';

import { useInvalidChildUrlCleanup } from '../useInvalidChildUrlCleanup';
import * as useActiveChildModule from '../useActiveChild';

vi.mock('react-toastify', () => ({
  toast: {
    info: vi.fn(),
  },
}));

describe('useInvalidChildUrlCleanup', () => {
  const createWrapper =
    (initialEntries = ['/events?child=invalid-id']) =>
    ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    );

  const useTestConsumer = () => {
    useInvalidChildUrlCleanup();
    const [searchParams] = useSearchParams();
    return { searchParams };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('triggers toast notification and strips child params when invalid child in URL and has children', () => {
    vi.spyOn(useActiveChildModule, 'useActiveChild').mockReturnValue({
      activeChild: undefined,
      activeChildId: 'child-1',
      isInvalidChildInUrl: true,
      firstChild: undefined,
      childrenList: [],
      hasChildren: true,
    });

    const { result } = renderHook(() => useTestConsumer(), {
      wrapper: createWrapper([
        '/events?child=invalid-id&childId=legacy-id&themePath=rytmi',
      ]),
    });

    expect(toast.info).toHaveBeenCalledWith(
      'Valittua lasta ei löytynyt profiilistasi. Näytetään ensimmäisen lapsen tapahtumat.'
    );
    expect(result.current.searchParams.get('child')).toBeNull();
    expect(result.current.searchParams.get('childId')).toBeNull();
    expect(result.current.searchParams.get('themePath')).toBe('rytmi');
  });

  it('does nothing when child in URL is valid', () => {
    vi.spyOn(useActiveChildModule, 'useActiveChild').mockReturnValue({
      activeChild: undefined,
      activeChildId: 'child-1',
      isInvalidChildInUrl: false,
      firstChild: undefined,
      childrenList: [],
      hasChildren: true,
    });

    const { result } = renderHook(() => useTestConsumer(), {
      wrapper: createWrapper(['/events?child=valid-id']),
    });

    expect(toast.info).not.toHaveBeenCalled();
    expect(result.current.searchParams.get('child')).toBe('valid-id');
  });

  it('does nothing when guardian has no children', () => {
    vi.spyOn(useActiveChildModule, 'useActiveChild').mockReturnValue({
      activeChild: undefined,
      activeChildId: undefined,
      isInvalidChildInUrl: true,
      firstChild: undefined,
      childrenList: [],
      hasChildren: false,
    });

    const { result } = renderHook(() => useTestConsumer(), {
      wrapper: createWrapper(['/events?child=invalid-id']),
    });

    expect(toast.info).not.toHaveBeenCalled();
    expect(result.current.searchParams.get('child')).toBe('invalid-id');
  });
});
