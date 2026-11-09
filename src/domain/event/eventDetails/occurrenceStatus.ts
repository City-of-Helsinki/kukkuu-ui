import { isOccurrenceFull } from '../EventUtils';

export enum OccurrenceStatus {
  Enrolled = 'enrolled',
  Full = 'full',
  Available = 'available',
}

export type OccurrenceStatusParams = {
  remainingCapacity?: number | null;
  isEnrolledHere?: boolean;
};

/**
 * Resolves the primary visual and actionable status of an occurrence.
 *
 * Precedence:
 * 1. OccurrenceStatus.Enrolled if the child is already enrolled in this occurrence.
 * 2. OccurrenceStatus.Full if remaining capacity is fewer than the minimum seats required (< 2).
 * 3. OccurrenceStatus.Available otherwise.
 */
export function getOccurrenceStatus({
  remainingCapacity,
  isEnrolledHere = false,
}: OccurrenceStatusParams): OccurrenceStatus {
  if (isEnrolledHere) {
    return OccurrenceStatus.Enrolled;
  }
  if (isOccurrenceFull(remainingCapacity)) {
    return OccurrenceStatus.Full;
  }
  return OccurrenceStatus.Available;
}

export default getOccurrenceStatus;
