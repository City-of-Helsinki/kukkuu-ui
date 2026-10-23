import { afterEach, beforeEach, vi } from 'vitest';
import i18n from 'i18next';

import { EnrolmentDeniedReason } from '../../api/generatedTypes/graphql';
import {
  formatOccurrenceTime,
  getEarliestRegistrationOpensAt,
  getEnrolmentDeniedNotice,
  getRegistrationOpens,
} from '../EventUtils';

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

  describe('getRegistrationOpens', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2030-06-01T00:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    test('returns the date and time in Helsinki summer time', () => {
      expect(getRegistrationOpens('2030-06-01T07:00:00+00:00')).toEqual({
        date: '1.6.2030',
        time: '10:00',
      });
    });

    test('returns the date and time in Helsinki winter time', () => {
      expect(getRegistrationOpens('2030-12-24T08:00:00Z')).toEqual({
        date: '24.12.2030',
        time: '10:00',
      });
    });

    test('returns null when the opening time is in the past', () => {
      expect(getRegistrationOpens('2030-05-31T21:00:00Z')).toBeNull();
    });

    test('returns null when the opening time is now', () => {
      expect(getRegistrationOpens('2030-06-01T00:00:00Z')).toBeNull();
    });

    test.each([null, undefined, ''])(
      'returns null when the opening time is "%s"',
      (value) => {
        expect(getRegistrationOpens(value)).toBeNull();
      }
    );

    test('returns null when the opening time is not a valid date', () => {
      expect(getRegistrationOpens('not a date')).toBeNull();
    });
  });

  describe('getEarliestRegistrationOpensAt', () => {
    test('returns the earliest valid opening time as a UTC ISO string', () => {
      expect(
        getEarliestRegistrationOpensAt([
          null,
          { registrationOpensAt: 'not a date' },
          { registrationOpensAt: '2030-07-01T12:00:00+03:00' },
          undefined,
          { registrationOpensAt: '' },
          { registrationOpensAt: '2030-06-01T10:00:00+03:00' },
          {},
          { registrationOpensAt: null },
          { registrationOpensAt: '2030-08-15T06:30:00Z' },
          { registrationOpensAt: undefined },
        ])
      ).toBe('2030-06-01T07:00:00.000Z');
    });

    test('returns null when no event has a valid opening time', () => {
      expect(
        getEarliestRegistrationOpensAt([
          null,
          undefined,
          {},
          { registrationOpensAt: null },
          { registrationOpensAt: '' },
          { registrationOpensAt: 'not a date' },
        ])
      ).toBeNull();
      expect(getEarliestRegistrationOpensAt([])).toBeNull();
    });
  });

  describe('getEnrolmentDeniedNotice', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2099-01-01T00:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    test('returns the opening time when REGISTRATION_NOT_OPEN and opening time is in future', () => {
      expect(
        getEnrolmentDeniedNotice({
          t: i18n.t,
          enrolmentDeniedReason: EnrolmentDeniedReason.RegistrationNotOpen,
          registrationOpensAt: '2099-06-01T07:00:00+00:00',
        })
      ).toBe('Ilmoittautuminen alkaa 1.6.2099 klo 10:00');
    });

    test.each([
      ['in past', '1985-06-01T07:00:00Z'],
      ['missing', null],
    ])(
      'returns generic not-opened-yet notice when REGISTRATION_NOT_OPEN and opening time is %s',
      (_, registrationOpensAt) => {
        expect(
          getEnrolmentDeniedNotice({
            t: i18n.t,
            enrolmentDeniedReason: EnrolmentDeniedReason.RegistrationNotOpen,
            registrationOpensAt,
          })
        ).toBe('Ilmoittautuminen ei ole vielä alkanut');
      }
    );

    test.each([
      ...Object.values(EnrolmentDeniedReason).filter(
        (reason) => reason !== EnrolmentDeniedReason.RegistrationNotOpen
      ),
      null,
      undefined,
    ])(
      'returns cannot-enroll notice when denial reason is %s and opening time is in future',
      (enrolmentDeniedReason) => {
        expect(
          getEnrolmentDeniedNotice({
            t: i18n.t,
            enrolmentDeniedReason,
            registrationOpensAt: '2099-06-01T07:00:00+00:00',
          })
        ).toMatch(/Huomioithan, että et voi ilmoittautua tähän tapahtumaan/);
      }
    );
  });
});
