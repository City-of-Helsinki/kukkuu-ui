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
  formatOccurrenceDateLong,
  formatOccurrenceDateRange,
  formatOccurrenceTimeRange,
} from '../../common/time/occurrenceTime';
import { EventParticipantsPerInvite as EventParticipantsPerInviteEnum } from '../api/generatedTypes/graphql';
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
export const formatDuration = (minutes?: number | null): string | null => {
  if (!minutes || minutes <= 0) return null;

  // Calculate full hours and leftover minutes
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  // When both hours and remaining minutes are present (e.g. "1 h 30 min")
  if (hours > 0 && remainingMinutes > 0) {
    return `${hours} h ${remainingMinutes} min`;
  }
  // When duration is in exact hours (e.g. "2 h")
  if (hours > 0) {
    return `${hours} h`;
  }
  // When duration is strictly under an hour (e.g. "45 min")
  return `${remainingMinutes} min`;
};

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
 * Formats date and time text for the event hero section based on selected occurrence
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

