import { useMemo } from 'react';

import { useProfileContext } from '../../profile/hooks/useProfileContext';

export interface ChildEnrolmentInfo {
  childName: string;
  guardianName: string;
  isEnrolledInEvent: boolean;
  enrolledOccurrenceId: string | null;
  enrolledOccurrenceTime: string | null;
  enrolledOccurrenceVenueName: string | null;
  enrolmentId: string | null;
  isEnrolledInOccurrence: (occurrenceId?: string | null) => boolean;
}

export const useChildEnrolment = (
  childId?: string | null,
  eventId?: string | null
): ChildEnrolmentInfo => {
  const { profile } = useProfileContext();

  return useMemo(() => {
    if (!profile || !childId) {
      return {
        childName: '',
        guardianName: '',
        isEnrolledInEvent: false,
        enrolledOccurrenceId: null,
        enrolledOccurrenceTime: null,
        enrolledOccurrenceVenueName: null,
        enrolmentId: null,
        isEnrolledInOccurrence: () => false,
      };
    }

    const guardianName = [profile.firstName, profile.lastName]
      .filter(Boolean)
      .join(' ');

    const childNode = (profile.children?.edges || [])
      .map((edge) => edge?.node)
      .find((c) => c?.id === childId);

    const childName = childNode?.name || '';

    const matchingEnrolment = (childNode?.enrolments?.edges || [])
      .map((edge) => edge?.node)
      .find((enrolment) => enrolment?.occurrence?.event?.id === eventId);

    const enrolledOccurrenceId = matchingEnrolment?.occurrence?.id ?? null;
    const enrolledOccurrenceTime = matchingEnrolment?.occurrence?.time ?? null;
    const enrolledOccurrenceVenueName =
      matchingEnrolment?.occurrence?.venue?.name ?? null;
    const enrolmentId = matchingEnrolment?.id ?? null;

    return {
      childName,
      guardianName,
      isEnrolledInEvent: Boolean(matchingEnrolment),
      enrolledOccurrenceId,
      enrolledOccurrenceTime,
      enrolledOccurrenceVenueName,
      enrolmentId,
      isEnrolledInOccurrence: (occurrenceId?: string | null) =>
        Boolean(occurrenceId && enrolledOccurrenceId === occurrenceId),
    };
  }, [profile, childId, eventId]);
};

export default useChildEnrolment;

