import React from 'react';
import type { TFunction } from 'i18next';
import { IconGroup } from 'hds-react';
import { addMinutes } from 'date-fns/addMinutes';
import uniqBy from 'lodash/uniqBy';
import { differenceInHours } from 'date-fns/differenceInHours';

import { formatTime, newDate } from '../../common/time/utils';
import {
  BACKEND_DATE_FORMAT,
  DEFAULT_DATE_FORMAT,
  DEFAULT_TIME_FORMAT,
} from '../../common/time/TimeConstants';
import {
  formatDuration,
  formatOccurrenceDateLong,
  formatOccurrenceDateRange,
  formatOccurrenceTimeRange,
} from '../../common/time/occurrenceTime';
import {
  EnrolmentDeniedReason,
  EventParticipantsPerInvite as EventParticipantsPerInviteEnum,
} from '../api/generatedTypes/graphql';
import RelayList from '../api/relayList';
import { OccurrenceNode, Occurrences } from './types/EventQueryTypes';
import AppConfig from '../app/AppConfig';

const OccurrenceList = RelayList<OccurrenceNode>();

/**
 * @deprecated Legacy filter option generator for Formik date select dropdowns.
 * Superseded by the occurrences table in `EventDetailsPage`.
 */
export function getDateOptions(occurrences?: Occurrences) {
  const options = OccurrenceList(occurrences).items.map(({ id, time }) => ({
    value: formatTime(newDate(time), BACKEND_DATE_FORMAT),
    label: formatTime(newDate(time), DEFAULT_DATE_FORMAT),
    key: id,
  }));

  return uniqBy(options, 'value');
}

/**
 * @deprecated Legacy filter option generator for Formik time select dropdowns.
 * Superseded by the occurrences table in `EventDetailsPage`.
 */
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

/**
 * @deprecated Superseded by `formatOccurrenceTimeRange` in `src/common/time/occurrenceTime.ts`.
 */
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

export const MIN_SEATS_PER_ENROLMENT = 2;

/**
 * Returns true if an occurrence has fewer seats remaining than the minimum
 * required for an enrolment (2 seats: 1 child + 1 guardian).
 */
export function isOccurrenceFull(
  remainingCapacity: number | null | undefined
): boolean {
  if (remainingCapacity == null) {
    return false;
  }
  return remainingCapacity < MIN_SEATS_PER_ENROLMENT;
}

export function getParticipantsIcon(iconType: EventParticipantsPerInviteEnum) {
  switch (iconType) {
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
  occurrenceTime: Date | string,
  enrolmentCancellationTimeLimitHours = AppConfig.enrolmentCancellationTimeLimitHours
) => {
  const occurrenceDate =
    typeof occurrenceTime === 'string'
      ? new Date(occurrenceTime)
      : occurrenceTime;
  const hoursDiff = differenceInHours(occurrenceDate, new Date());
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
    .map((event) =>
      new Date(event?.registrationOpensAt ?? Number.NaN).getTime()
    )
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
  if (enrolmentDeniedReason === EnrolmentDeniedReason.RegistrationNotOpen) {
    const { key, values } = getRegistrationNotOpenNotice(registrationOpensAt);
    return t(key, values);
  }
  if (
    enrolmentDeniedReason === EnrolmentDeniedReason.AlreadyJoinedEventGroup ||
    enrolmentDeniedReason ===
      EnrolmentDeniedReason.AlreadyHasPasswordToEventGroup
  ) {
    return t('search.card.alreadyEnrolledSeasonNotice');
  }
  if (
    enrolmentDeniedReason === EnrolmentDeniedReason.YearlyEnrolmentLimitReached
  ) {
    return t('search.card.yearlyLimitReachedNotice');
  }
  return t('enrollPage.message.cantEnrollNotice');
};

export type VenueLike = {
  id?: string | null;
  name?: string | null;
  address?: string | null;
  description?: string | null;
  postalCode?: string | null;
  city?: string | null;
};

/**
 * Extracts unique venues from an optional selected occurrence or a list of occurrences.
 * If a selected occurrence has a venue, returns an array containing that single venue.
 * Otherwise, collects deduplicated venues across all provided occurrences.
 *
 * @param selectedOccurrence - The currently selected occurrence, if any.
 * @param occurrences - All available occurrences for the event.
 * @returns An array of unique venues.
 */
export function extractUniqueVenues<T extends { venue?: VenueLike | null }>(
  selectedOccurrence?: T | null,
  occurrences: T[] = []
): NonNullable<T['venue']>[] {
  if (selectedOccurrence?.venue) {
    return [selectedOccurrence.venue];
  }
  const map = new Map<string, NonNullable<T['venue']>>();
  for (const occ of occurrences) {
    if (occ.venue && (occ.venue.id || occ.venue.name || occ.venue.address)) {
      const key =
        occ.venue.id || `${occ.venue.name ?? ''}-${occ.venue.address ?? ''}`;
      if (!map.has(key)) {
        map.set(key, occ.venue);
      }
    }
  }
  return Array.from(map.values());
}

/**
 * Extracts unique lowercase language codes from an optional selected occurrence or a list of occurrences.
 * If a selected occurrence has a language, returns an array containing that single lowercase code.
 * Otherwise, collects deduplicated lowercase language codes across all provided occurrences.
 *
 * @param selectedOccurrence - The currently selected occurrence, if any.
 * @param occurrences - All available occurrences for the event.
 * @returns An array of unique lowercase language codes.
 */
export function extractUniqueLanguages<
  O extends { occurrenceLanguage?: string | null }
>(
  selectedOccurrence?: O | null,
  occurrences: O[] = []
): string[] {
  if (selectedOccurrence?.occurrenceLanguage) {
    return [selectedOccurrence.occurrenceLanguage.toLowerCase()];
  }
  const set = new Set<string>();
  for (const occ of occurrences) {
    if (occ.occurrenceLanguage) {
      set.add(occ.occurrenceLanguage.toLowerCase());
    }
  }
  return Array.from(set.values());
}

/**
 * Formats a duration in minutes into a human-readable string (e.g. "1 h 30 min", "2 h", or "45 min").
 * Returns null if minutes is null, undefined, or less than or equal to 0.
 *
 * @param minutes - Total duration in minutes.
 * @returns Formatted duration string, or null if duration is invalid or non-positive.
 */
export { formatDuration };

/**
 * Sorts occurrences chronologically in ascending order by their start time.
 *
 * @param occurrences - List of occurrences to sort.
 * @returns A new array sorted by occurrence start time ascending.
 */
export function sortOccurrencesByTime<T extends { time: string | Date }>(
  occurrences: T[]
): T[] {
  return [...occurrences].sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
  );
}

/**
 * Finds the enrolled occurrence from a list of occurrences or the currently selected occurrence
 * by matching the enrolled occurrence ID.
 *
 * @param enrolledOccurrenceId - The ID of the enrolled occurrence, if known.
 * @param occurrences - The list of all occurrences to search through.
 * @param selectedOccurrence - The currently selected occurrence fallback.
 * @returns The matching enrolled occurrence, or null if not found or no ID provided.
 */
export function findEnrolledOccurrence<T extends { id?: string | null }>(
  enrolledOccurrenceId?: string | null,
  occurrences: T[] = [],
  selectedOccurrence?: T | null
): T | null {
  if (!enrolledOccurrenceId) {
    return null;
  }
  return (
    occurrences.find((o) => o.id === enrolledOccurrenceId) ??
    (selectedOccurrence?.id === enrolledOccurrenceId
      ? selectedOccurrence
      : null)
  );
}

type FormatEventHeroDateTimeOptions<T extends { time: string | Date }> = {
  selectedOccurrence?: T | null;
  allOccurrences?: T[];
  duration?: number | null;
  locale?: string;
  t: TFunction;
};

/**
 * Formats date and time text for event hero and sidebar sections based on selected occurrence
 * or all available occurrences (single occurrence vs date range with count).
 *
 * @param options - Configuration and localization options.
 * @returns Formatted date and time string, or null if no occurrences exist.
 */
export function formatEventHeroDateTime<T extends { time: string | Date }>({
  selectedOccurrence,
  allOccurrences = [],
  duration,
  locale = 'fi',
  t,
}: FormatEventHeroDateTimeOptions<T>): string | null {
  if (selectedOccurrence) {
    return [
      formatOccurrenceDateLong(selectedOccurrence.time, locale),
      formatOccurrenceTimeRange(selectedOccurrence.time, duration),
    ].join(', ');
  }
  if (allOccurrences.length === 1) {
    return [
      formatOccurrenceDateLong(allOccurrences[0].time, locale),
      formatOccurrenceTimeRange(allOccurrences[0].time, duration),
    ].join(', ');
  }
  if (allOccurrences.length > 1) {
    const validOccurrences = allOccurrences.filter((o) => Boolean(o.time));
    if (validOccurrences.length === 0) {
      return t('event.sidebar.occurrencesCount', {
        count: allOccurrences.length,
      });
    }

    const sortedOccurrences = sortOccurrencesByTime(validOccurrences);
    const firstOccurrence = sortedOccurrences[0];
    const lastOccurrence = sortedOccurrences.at(-1);
    if (!firstOccurrence || !lastOccurrence) {
      return null;
    }
    const dateRange = formatOccurrenceDateRange(
      firstOccurrence.time,
      lastOccurrence.time
    );

    return t('event.hero.dateRangeWithCount', {
      dateRange,
      count: allOccurrences.length,
      defaultValue: t('search.card.dateRangeWithCount', {
        dateRange,
        count: allOccurrences.length,
      }),
    });
  }
  return null;
}

export type VenueWithDetails = {
  description?: string | null;
  accessibilityInfo?: string | null;
  arrivalInstructions?: string | null;
  wcAndFacilities?: string | null;
};

/**
 * Checks whether a venue has any additional detailed text suitable for the details modal.
 */
export function venueHasDetailedInfo(
  venue?: VenueWithDetails | null
): boolean {
  if (!venue) return false;
  return Boolean(
    (venue.description && venue.description.trim().length > 0) ||
      (venue.accessibilityInfo && venue.accessibilityInfo.trim().length > 0) ||
      (venue.arrivalInstructions &&
        venue.arrivalInstructions.trim().length > 0) ||
      (venue.wcAndFacilities && venue.wcAndFacilities.trim().length > 0)
  );
}

