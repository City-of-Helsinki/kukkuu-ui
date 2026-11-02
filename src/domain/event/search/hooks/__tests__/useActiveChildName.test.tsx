import React from 'react';
import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';

import { useActiveChildName } from '../useActiveChildName';
import {
  ProfileContext,
  type ProfileContextType,
  type ProfileType,
} from '../../../../profile/ProfileContext';
import {
  EventSearchUrlContext,
  type EventSearchUrlContextType,
} from '../../context/EventSearchUrlContext';

describe('useActiveChildName', () => {
  const mockProfile = {
    children: {
      edges: [
        { node: { id: 'child-1', name: 'Profile Name' } },
        { node: { id: 'child-2', name: 'Second Child' } },
      ],
    },
  } as unknown as ProfileType;

  const createWrapper = (
    profile?: ProfileType | null,
    activeChildId?: string
  ) => {
    return ({ children }: { children: React.ReactNode }) => (
      <ProfileContext.Provider
        value={{ profile: profile ?? null } as unknown as ProfileContextType}
      >
        <EventSearchUrlContext.Provider
          value={
            { activeChildId } as unknown as EventSearchUrlContextType
          }
        >
          {children}
        </EventSearchUrlContext.Provider>
      </ProfileContext.Provider>
    );
  };

  it('prioritizes name from the search child node', () => {
    const { result } = renderHook(
      () => useActiveChildName({ name: 'Search Query Name' } as any),
      { wrapper: createWrapper(mockProfile, 'child-1') }
    );
    expect(result.current).toBe('Search Query Name');
  });

  it('falls back to guardian profile when search child node name is absent', () => {
    const { result } = renderHook(() => useActiveChildName(null), {
      wrapper: createWrapper(mockProfile, 'child-1'),
    });
    expect(result.current).toBe('Profile Name');
  });

  it('returns empty string when child is not found in search or profile', () => {
    const { result } = renderHook(() => useActiveChildName(null), {
      wrapper: createWrapper(mockProfile, 'child-unknown'),
    });
    expect(result.current).toBe('');
  });

  it('returns empty string when profile is null and searchChild has no name', () => {
    const { result } = renderHook(() => useActiveChildName(null), {
      wrapper: createWrapper(null, 'child-1'),
    });
    expect(result.current).toBe('');
  });
});

