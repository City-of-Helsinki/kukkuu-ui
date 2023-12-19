import { IconGroup } from 'hds-react';

import { formatTime, newMoment } from '../../common/time/utils';
import { DEFAULT_TIME_FORMAT } from '../../common/time/TimeConstants';
import { EventParticipantsPerInvite as EventParticipantsPerInviteEnum } from '../api/generatedTypes/graphql';

export const formatOccurrenceTime = (
  startTimeRaw: Date,
  durationMinutes: number | null
) => {
  let occurrenceTime;
  const startTime = formatTime(newMoment(startTimeRaw), DEFAULT_TIME_FORMAT);

  if (durationMinutes) {
    const endTimeRaw = newMoment(startTimeRaw).add(durationMinutes, 'minutes');
    const endTime = formatTime(newMoment(endTimeRaw), DEFAULT_TIME_FORMAT);
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
