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
  occurrenceTime: Date,
  enrolmentCancellationTimeLimitHours = AppConfig.enrolmentCancellationTimeLimitHours
) => {
  const hoursDiff = differenceInHours(occurrenceTime, new Date());
  return Boolean(hoursDiff >= enrolmentCancellationTimeLimitHours);
};
