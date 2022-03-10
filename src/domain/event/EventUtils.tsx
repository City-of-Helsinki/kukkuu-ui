import { formatTime, newMoment } from '../../common/time/utils';
import { DEFAULT_TIME_FORMAT } from '../../common/time/TimeConstants';
import { EventParticipantsPerInvite as EventParticipantsPerInviteEnum } from '../api/generatedTypes/globalTypes';
import personIcon from '../../assets/icons/svg/person.svg';

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
    case EventParticipantsPerInviteEnum.CHILD_AND_1_OR_2_GUARDIANS:
    case EventParticipantsPerInviteEnum.CHILD_AND_GUARDIAN:
    case EventParticipantsPerInviteEnum.FAMILY:
    default:
      return personIcon;
  }
}
