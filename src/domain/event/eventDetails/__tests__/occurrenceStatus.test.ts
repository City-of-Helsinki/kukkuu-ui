import { describe, expect, it } from 'vitest';

import { getOccurrenceStatus, OccurrenceStatus } from '../occurrenceStatus';

describe('getOccurrenceStatus', () => {
  it('returns OccurrenceStatus.Enrolled when isEnrolledHere is true regardless of capacity', () => {
    expect(
      getOccurrenceStatus({ remainingCapacity: 10, isEnrolledHere: true })
    ).toBe(OccurrenceStatus.Enrolled);
    expect(
      getOccurrenceStatus({ remainingCapacity: 0, isEnrolledHere: true })
    ).toBe(OccurrenceStatus.Enrolled);
    expect(
      getOccurrenceStatus({ remainingCapacity: null, isEnrolledHere: true })
    ).toBe(OccurrenceStatus.Enrolled);
  });

  it('returns OccurrenceStatus.Full when remaining capacity is fewer than 2', () => {
    expect(
      getOccurrenceStatus({ remainingCapacity: 0, isEnrolledHere: false })
    ).toBe(OccurrenceStatus.Full);
    expect(
      getOccurrenceStatus({ remainingCapacity: 1, isEnrolledHere: false })
    ).toBe(OccurrenceStatus.Full);
  });

  it('returns OccurrenceStatus.Available when remaining capacity is 2 or more', () => {
    expect(
      getOccurrenceStatus({ remainingCapacity: 2, isEnrolledHere: false })
    ).toBe(OccurrenceStatus.Available);
    expect(
      getOccurrenceStatus({ remainingCapacity: 14, isEnrolledHere: false })
    ).toBe(OccurrenceStatus.Available);
    expect(
      getOccurrenceStatus({ remainingCapacity: 66, isEnrolledHere: false })
    ).toBe(OccurrenceStatus.Available);
  });

  it('returns OccurrenceStatus.Available when capacity is null (unlimited)', () => {
    expect(
      getOccurrenceStatus({ remainingCapacity: null, isEnrolledHere: false })
    ).toBe(OccurrenceStatus.Available);
  });
});
