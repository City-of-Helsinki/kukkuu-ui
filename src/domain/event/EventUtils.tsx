import { IconGroup } from 'hds-react';
import { addMinutes } from 'date-fns/addMinutes';
import uniqBy from 'lodash/uniqBy';
import { differenceInHours } from 'date-fns/differenceInHours';
import type { TFunction } from 'i18next';

import { formatTime, newDate } from '../../common/time/utils';
import {
  BACKEND_DATE_FORMAT,
  DEFAULT_DATE_FORMAT,
  DEFAULT_TIME_FORMAT,
} from '../../common/time/TimeConstants';
import {
  EnrolmentDeniedReason,
  EventParticipantsPerInvite as EventParticipantsPerInviteEnum,
} from '../api/generatedTypes/graphql';
import RelayList from '../api/relayList';
import { OccurrenceNode, Occurrences } from './types/EventQueryTypes';
import AppConfig from '../app/AppConfig';

const OccurrenceList = RelayList<OccurrenceNode>();

export function getDateOptions(occurrences?: Occurrences) {
  const options = OccurrenceList(occurrences).items.map(({ id, time }) => ({
    value: formatTime(newDate(time), BACKEND_DATE_FORMAT),
    label: formatTime(newDate(time), DEFAULT_DATE_FORMAT),
    key: id,
  }));

  return uniqBy(options, 'value');
}

export function getTimeOptions(occurrences?: Occurrences) {
  const options = OccurrenceList(occurrences).items.map(
    ({ id, time, event }) => ({
      value: formatTime(newDate(time), DEFAULT_TIME_FORMAT),
      label: formatOccurrenceTime(time, event.duration),
      key: id,
    })
  );
  const uniqueOptions = uniqBy(options, 'value');

  return uniqueOptions.sort((a, b) =>
    (a.label ?? '').localeCompare(b.label ?? '')
  );
}

export const formatOccurrenceTime = (
  startTimeRaw: Date,
  durationMinutes: number | null
) => {
  let occurrenceTime;
  const startTime = formatTime(newDate(startTimeRaw), DEFAULT_TIME_FORMAT);

  if (durationMinutes) {
    const endTimeRaw = addMinutes(newDate(startTimeRaw), durationMinutes);
    const endTime = formatTime(endTimeRaw, DEFAULT_TIME_FORMAT);
    occurrenceTime = `${startTime} - ${endTime}`;
  } else {
    occurrenceTime = startTime;
  }

  return occurrenceTime;
};

export function getParticipantsIcon(iconType: EventParticipantsPerInviteEnum) {
  switch (iconType) {
    case EventParticipantsPerInviteEnum.ChildAnd_1Or_2Guardians:
    case EventParticipantsPerInviteEnum.ChildAndGuardian:
    case EventParticipantsPerInviteEnum.Family:
    default:
      return <IconGroup />;
  }
}

/**
 * Should the user be allowed to unenrol from an event occurrence?
 * This function checks if the current time is at least
 * `AppConfig.enrolmentCancellationTimeLimitHours` (e.g. 48) hours
 * before the occurrence time. If it is, the user can unenrol;
 * otherwise, they cannot.
 */
export const shouldAllowUnenrolment = (
  occurrenceTime: Date,
  enrolmentCancellationTimeLimitHours = AppConfig.enrolmentCancellationTimeLimitHours
) => {
  const hoursDiff = differenceInHours(occurrenceTime, new Date());
  return Boolean(hoursDiff >= enrolmentCancellationTimeLimitHours);
};

export type RegistrationOpens = { date: string; time: string };

/**
 * Returns the date and time in Helsinki time if registrationOpensAt is in
 * the future, otherwise null.
 *
 * @param registrationOpensAt The event's registration opening time as an
 * ISO 8601 datetime string, e.g. "2030-06-01T10:00:00+03:00". Null or
 * undefined when the event has no opening time, i.e. registration is not
 * limited.
 */
export const getRegistrationOpens = (
  registrationOpensAt?: string | null
): RegistrationOpens | null => {
  if (!registrationOpensAt) return null;
  const opensAt = new Date(registrationOpensAt);

  if (opensAt.getTime() > Date.now()) {
    const zonedOpensAt = newDate(opensAt);
    return {
      date: formatTime(zonedOpensAt, DEFAULT_DATE_FORMAT),
      time: formatTime(zonedOpensAt, DEFAULT_TIME_FORMAT),
    };
  }
  return null;
};

export type RegistrationNotOpenNotice = {
  key:
    | 'enrollPage.message.registrationOpens'
    | 'enrollPage.message.registrationNotOpen';
  values?: RegistrationOpens;
};

/**
 * Returns the translation key and values for telling that registration is
 * not open. Tells when it opens if registrationOpensAt is in the future,
 * otherwise falls back to the generic "not opened yet" text.
 */
export const getRegistrationNotOpenNotice = (
  registrationOpensAt?: string | null
): RegistrationNotOpenNotice => {
  const registrationOpens = getRegistrationOpens(registrationOpensAt);
  return registrationOpens
    ? { key: 'enrollPage.message.registrationOpens', values: registrationOpens }
    : { key: 'enrollPage.message.registrationNotOpen' };
};

/**
 * Returns the earliest registrationOpensAt of the given events, or null if
 * none of them has a valid one.
 *
 * @returns The earliest opening time as an ISO 8601 datetime string in UTC,
 * e.g. "2030-06-01T07:00:00.000Z", or null.
 */
export const getEarliestRegistrationOpensAt = (
  events: ReadonlyArray<
    { registrationOpensAt?: string | null } | null | undefined
  >
): string | null => {
  const times = events
    .map((event) => new Date(event?.registrationOpensAt ?? NaN).getTime())
    .filter((time) => !Number.isNaN(time));

  return times.length ? new Date(Math.min(...times)).toISOString() : null;
};

/**
 * Return the notice explaining why a child cannot enroll to an event.
 */
export const getEnrolmentDeniedNotice = ({
  t,
  enrolmentDeniedReason,
  registrationOpensAt,
}: {
  t: TFunction;
  enrolmentDeniedReason?: EnrolmentDeniedReason | null;
  registrationOpensAt?: string | null;
}): string => {
  if (enrolmentDeniedReason !== EnrolmentDeniedReason.RegistrationNotOpen) {
    return t('enrollPage.message.cantEnrollNotice');
  }
  const { key, values } = getRegistrationNotOpenNotice(registrationOpensAt);
  return t(key, values);
};
