import { createReducer } from '@reduxjs/toolkit';

import { EVENT_ACTIONS } from '../constants/EventActionConstants';
import { ChildEvents } from '../type/EventChildTypes';
import { profileQuery_myProfile_children_edges as edges } from '../../api/generatedTypes/profileQuery';
import { enrolOccurrenceMutation_enrolOccurrence_enrolment_child_enrolments_edges as EnrolmentNodeEdge } from '../../api/generatedTypes/enrolOccurrenceMutation';
import { unenrolOccurrenceMutation_unenrolOccurrence_child_enrolments_edges as UnEnrolmentNodeEdge } from '../../api/generatedTypes/unenrolOccurrenceMutation';

export const defaultChildEventData: ChildEvents[] = [];

export default createReducer(defaultChildEventData, {
  [EVENT_ACTIONS.CLEAR_EVENT]: (state) => (state = defaultChildEventData),
  [EVENT_ACTIONS.SAVE_CHILDREN_EVENTS]: (state, action) => {
    const childrenEvents: ChildEvents[] = [];
    action.payload?.edges?.forEach((childEdge: edges) => {
      const events: string[] = [];
      childEdge?.node?.enrolments?.edges?.forEach((enrolEdge) => {
        if (childEdge?.node?.id && enrolEdge?.node?.occurrence.event.id) {
          events.push(enrolEdge.node.occurrence.event.id);
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
    const events: string[] = action.payload.enrolments.edges.map(
      (enrolEdge: EnrolmentNodeEdge | UnEnrolmentNodeEdge) => {
        return enrolEdge.node?.occurrence.event.id;
      }
    );
    return state.map((child) =>
      child.childId === action.payload.childId
        ? { ...child, eventIds: events }
        : child
    );
  },
});
