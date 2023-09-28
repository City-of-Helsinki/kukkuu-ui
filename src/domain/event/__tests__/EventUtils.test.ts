import { formatOccurrenceTime } from '../EventUtils';

// NOTE: After upgrade in KK-1017, this date needed the Finnish timezone, but the reason is unknown.
const startTimeRaw = new Date('2020-04-25T09:34:00+03:00');
const durationMinutes = 60;

describe('EventUtils', () => {
  describe('formatOccurrenceTime', () => {
    test('should format correctly', () => {
      expect(formatOccurrenceTime(startTimeRaw, durationMinutes)).toEqual(
        '09:34 - 10:34'
      );
    });
  });
});
