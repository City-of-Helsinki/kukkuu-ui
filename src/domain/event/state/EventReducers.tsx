import { createReducer } from '@reduxjs/toolkit';

import { EVENT_ACTIONS } from '../constants/EventActionConstants';
import { ChildEvents } from '../type/EventChildTypes';
import { profileQuery_myProfile_children_edges as edges } from '../../api/generatedTypes/profileQuery';
// eslint-disable-next-line max-len
import { enrolOccurrenceMutation_enrolOccurrence_enrolment_child_occurrences_edges as EnrolmentNodeEdge } from '../../api/generatedTypes/enrolOccurrenceMutation';
// eslint-disable-next-line max-len
import { unenrolOccurrenceMutation_unenrolOccurrence_child_occurrences_edges as UnEnrolmentNodeEdge } from '../../api/generatedTypes/unenrolOccurrenceMutation';

export const defaultChildEventData: ChildEvents[] = [];

export default createReducer(defaultChildEventData, {
  [EVENT_ACTIONS.CLEAR_EVENT]: (state) => (state = defaultChildEventData),
  [EVENT_ACTIONS.SAVE_CHILDREN_EVENTS]: (state, action) => {
    const childrenEvents: ChildEvents[] = [];
    action.payload?.edges?.forEach((childEdge: edges) => {
      const events: string[] = [];
      childEdge?.node?.occurrences?.edges?.forEach((occurrenceEdge) => {
        if (childEdge?.node?.id && occurrenceEdge?.node?.event.id) {
          events.push(occurrenceEdge.node.event.id);
        }
      });
      const childEvents: ChildEvents = {
        childId: childEdge.node?.id || 'a',
        eventIds: events,
      };
      childrenEvents.push(childEvents);
    });
    return childrenEvents;
  },
  [EVENT_ACTIONS.SAVE_CHILD_EVENTS]: (state, action) => {
    const events: string[] = action.payload.occurrences.edges.map(
      (enrolEdge: EnrolmentNodeEdge | UnEnrolmentNodeEdge) => {
        return enrolEdge.node?.event.id;
      }
    );
    return state.map((child) =>
      child.childId === action.payload.childId
        ? { ...child, eventIds: events }
        : child
    );
  },
});
