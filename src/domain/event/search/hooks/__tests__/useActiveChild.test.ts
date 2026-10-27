import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

import { useActiveChild } from '../useActiveChild';
import type { ProfileType } from '../../../../profile/ProfileContext';

let mockRouteParams: { childId?: string } = {};
let mockSearchParams = new URLSearchParams();

vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof import('react-router')>(
    'react-router'
  );
  return {
    ...actual,
    useParams: () => mockRouteParams,
    useSearchParams: () => [mockSearchParams, vi.fn()],
  };
});

describe('useActiveChild', () => {
  const mockChild1 = {
    id: 'child-1',
    name: 'Malla Mallikas',
    birthyear: 2020,
  };
  const mockChild2 = {
    id: 'child-2',
    name: 'Oona Mallikas',
    birthyear: 2022,
  };

  const mockProfileWithChildren = {
    id: 'p-1',
    firstName: 'Huoltaja',
    children: {
      edges: [
        { node: mockChild1 },
        { node: mockChild2 },
      ],
    },
  } as unknown as ProfileType;

  const mockProfileNoChildren = {
    id: 'p-2',
    firstName: 'Huoltaja Lapseton',
    children: {
      edges: [],
    },
  } as unknown as ProfileType;

  beforeEach(() => {
    mockRouteParams = {};
    mockSearchParams = new URLSearchParams();
  });

  it('defaults to first child when no child is specified in URL', () => {
    const { result } = renderHook(() =>
      useActiveChild({ profile: mockProfileWithChildren })
    );

    expect(result.current.hasChildren).toBe(true);
    expect(result.current.activeChild).toEqual(mockChild1);
    expect(result.current.activeChildId).toBe('child-1');
    expect(result.current.firstChild).toEqual(mockChild1);
    expect(result.current.isInvalidChildInUrl).toBe(false);
    expect(result.current.childrenList).toHaveLength(2);
  });

  it('selects matching child when ?child=<id> query parameter is present', () => {
    mockSearchParams = new URLSearchParams('child=child-2');

    const { result } = renderHook(() =>
      useActiveChild({ profile: mockProfileWithChildren })
    );

    expect(result.current.activeChild).toEqual(mockChild2);
    expect(result.current.activeChildId).toBe('child-2');
    expect(result.current.isInvalidChildInUrl).toBe(false);
  });

  it('supports ?childId=<id> alternative query parameter', () => {
    mockSearchParams = new URLSearchParams('childId=child-2');

    const { result } = renderHook(() =>
      useActiveChild({ profile: mockProfileWithChildren })
    );

    expect(result.current.activeChild).toEqual(mockChild2);
    expect(result.current.activeChildId).toBe('child-2');
    expect(result.current.isInvalidChildInUrl).toBe(false);
  });

  it('selects matching child when legacy route param childId is present', () => {
    mockRouteParams = { childId: 'child-2' };

    const { result } = renderHook(() =>
      useActiveChild({ profile: mockProfileWithChildren })
    );

    expect(result.current.activeChild).toEqual(mockChild2);
    expect(result.current.activeChildId).toBe('child-2');
    expect(result.current.isInvalidChildInUrl).toBe(false);
  });

  it('falls back to first child and flags isInvalidChildInUrl when requested child ID does not match profile', () => {
    mockSearchParams = new URLSearchParams('child=unknown-foreign-child');

    const { result } = renderHook(() =>
      useActiveChild({ profile: mockProfileWithChildren })
    );

    expect(result.current.activeChild).toEqual(mockChild1);
    expect(result.current.activeChildId).toBe('child-1');
    expect(result.current.isInvalidChildInUrl).toBe(true);
  });

  it('returns hasChildren=false and undefined activeChild when guardian has no children', () => {
    const { result } = renderHook(() =>
      useActiveChild({ profile: mockProfileNoChildren })
    );

    expect(result.current.hasChildren).toBe(false);
    expect(result.current.activeChild).toBeUndefined();
    expect(result.current.activeChildId).toBeUndefined();
    expect(result.current.firstChild).toBeUndefined();
    expect(result.current.isInvalidChildInUrl).toBe(false);
  });

  it('handles null/undefined profile gracefully while loading', () => {
    const { result } = renderHook(() => useActiveChild({ profile: null }));

    expect(result.current.hasChildren).toBe(false);
    expect(result.current.activeChild).toBeUndefined();
    expect(result.current.childrenList).toEqual([]);
    expect(result.current.isInvalidChildInUrl).toBe(false);
  });
});
