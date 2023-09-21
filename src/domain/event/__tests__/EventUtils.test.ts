import { formatOccurrenceTime } from '../EventUtils';

const startTimeRaw = new Date('2020-04-25T09:34:00+00:00');
const durationMinutes = 60;

describe('EventUtils', () => {
  describe('formatOccurrenceTime', () => {
    test('should format correctly', () => {
      expect(formatOccurrenceTime(startTimeRaw, durationMinutes)).toEqual(
        '12:34 - 13:34'
      );
    });
  });
});
