import React from 'react';
import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';

import {
  extractEnrolledEventIds,
  useChildEnrolledEventIds,
} from '../useChildEnrolledEventIds';
import {
  ProfileContext,
  type ProfileContextType,
  type ProfileType,
} from '../../../../profile/ProfileContext';
import {
  EventSearchUrlContext,
  type EventSearchUrlContextType,
} from '../../context/EventSearchUrlContext';

describe('useChildEnrolledEventIds and extractEnrolledEventIds', () => {
  const mockProfile = {
    children: {
      edges: [
        {
          node: {
            id: 'child-1',
            enrolments: {
              edges: [
                {
                  node: {
                    occurrence: {
                      event: { id: 'event-101' },
                    },
                  },
                },
                {
                  node: {
                    occurrence: {
                      event: { id: 'event-102' },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          node: {
            id: 'child-2',
            enrolments: {
              edges: [
                {
                  node: {
                    occurrence: {
                      event: { id: 'event-201' },
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    },
  } as unknown as ProfileType;

  describe('extractEnrolledEventIds pure utility', () => {
    it('extracts enrolled event IDs for the selected child', () => {
      const ids = extractEnrolledEventIds(mockProfile, 'child-1');
      expect(ids).toEqual(new Set(['event-101', 'event-102']));
    });

    it('returns an empty set when child has no enrolments', () => {
      const ids = extractEnrolledEventIds(mockProfile, 'child-nonexistent');
      expect(ids).toEqual(new Set());
    });

    it('returns an empty set when profile or activeChildId is null/undefined', () => {
      expect(extractEnrolledEventIds(null, 'child-1')).toEqual(new Set());
      expect(extractEnrolledEventIds(mockProfile, undefined)).toEqual(new Set());
    });
  });

  describe('useChildEnrolledEventIds hook with contexts', () => {
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

    it('resolves enrolled IDs using contexts', () => {
      const { result } = renderHook(() => useChildEnrolledEventIds(), {
        wrapper: createWrapper(mockProfile, 'child-1'),
      });
      expect(result.current).toEqual(new Set(['event-101', 'event-102']));
    });

    it('returns empty set when no activeChildId is present in context', () => {
      const { result } = renderHook(() => useChildEnrolledEventIds(), {
        wrapper: createWrapper(mockProfile, undefined),
      });
      expect(result.current).toEqual(new Set());
    });
  });
});

