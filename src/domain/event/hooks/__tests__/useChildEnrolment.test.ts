import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

import { useChildEnrolment } from '../useChildEnrolment';
import * as ProfileContextHook from '../../../profile/hooks/useProfileContext';

describe('useChildEnrolment', () => {
  it('returns default empty state when profile or childId is missing', () => {
    vi.spyOn(ProfileContextHook, 'useProfileContext').mockReturnValue({
      profile: null,
      refetch: vi.fn(),
      clearProfile: vi.fn(),
    } as any);

    const { result } = renderHook(() => useChildEnrolment(null, 'event-1'));

    expect(result.current.isEnrolledInEvent).toBe(false);
    expect(result.current.childName).toBe('');
    expect(result.current.guardianName).toBe('');
    expect(result.current.enrolledOccurrenceId).toBeNull();
    expect(result.current.isEnrolledInOccurrence('any-occ')).toBe(false);
  });

  it('correctly detects when child is enrolled in event and occurrence', () => {
    const mockProfile = {
      firstName: 'Maija',
      lastName: 'Meikäläinen',
      children: {
        edges: [
          {
            node: {
              id: 'child-1',
              name: 'Malla',
              enrolments: {
                edges: [
                  {
                    node: {
                      id: 'enrolment-1',
                      occurrence: {
                        id: 'occ-1',
                        time: '2026-11-01T10:00:00Z',
                        venue: { name: 'Musiikkitalo' },
                        event: { id: 'event-1' },
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    };

    vi.spyOn(ProfileContextHook, 'useProfileContext').mockReturnValue({
      profile: mockProfile,
      refetch: vi.fn(),
      clearProfile: vi.fn(),
    } as any);

    const { result } = renderHook(() =>
      useChildEnrolment('child-1', 'event-1')
    );

    expect(result.current.childName).toBe('Malla');
    expect(result.current.guardianName).toBe('Maija Meikäläinen');
    expect(result.current.isEnrolledInEvent).toBe(true);
    expect(result.current.enrolledOccurrenceId).toBe('occ-1');
    expect(result.current.enrolledOccurrenceVenueName).toBe('Musiikkitalo');
    expect(result.current.enrolmentId).toBe('enrolment-1');
    expect(result.current.isEnrolledInOccurrence('occ-1')).toBe(true);
    expect(result.current.isEnrolledInOccurrence('occ-2')).toBe(false);
  });
});

