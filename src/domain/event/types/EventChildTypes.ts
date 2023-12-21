import { EnrolOccurrences } from './EnrolOccurrenceMutationTypes';
import { UnenrolOccurrences } from './UnenrolOccurrenceMutationTypes';

export interface ChildEvents {
  childId: string;
  eventIds: string[];
}

export interface ChildOccurrences {
  childId: string;
  occurrences: EnrolOccurrences | UnenrolOccurrences;
}
