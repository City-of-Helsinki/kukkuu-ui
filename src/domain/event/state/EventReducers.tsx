import { createReducer } from '@reduxjs/toolkit';

import { ChildEvents } from '../types/EventChildTypes';
import {
  clearEvent,
  saveChildEvents,
  saveChildrenEvents,
} from './EventActions';

export const defaultChildEventData: ChildEvents[] = [];

const reducer = createReducer(defaultChildEventData, (builder) => {
  builder
    .addCase(clearEvent, (state) => ({ ...defaultChildEventData }))
    .addCase(saveChildrenEvents, (state, action) => {
      const childrenEvents: ChildEvents[] = [];
      action.payload?.edges?.forEach((childEdge) => {
        const events: string[] = [];
        childEdge?.node?.occurrences?.edges?.forEach((occurrenceEdge) => {
          if (childEdge?.node?.id && occurrenceEdge?.node?.event.id) {
            events.push(occurrenceEdge.node.event.id);
          }
        });
        const childEvents: ChildEvents = {
          childId: childEdge?.node?.id || 'a',
          eventIds: events,
        };
        childrenEvents.push(childEvents);
      });
      return childrenEvents;
    })
    .addCase(saveChildEvents, (state, action) => {
      const events: string[] =
        action.payload?.occurrences?.edges
          ?.map((enrolEdge) => {
            return enrolEdge?.node?.event.id ?? '';
          })
          .filter((eventId) => !!eventId) ?? [];
      return state.map((child) =>
        child.childId === action.payload.childId
          ? { ...child, eventIds: events }
          : child
      );
    });
});
export default reducer;
