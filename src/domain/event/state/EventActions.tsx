import { createAction } from '@reduxjs/toolkit';

import { ChildOccurrences } from '../types/EventChildTypes';
import { EVENT_ACTIONS } from '../constants/EventActionConstants';
import { MyProfileChildren } from '../../profile/types/ProfileQueryTypes';

const clearEvent = createAction(EVENT_ACTIONS.CLEAR_EVENT);
const saveChildEvents = createAction<ChildOccurrences>(
  EVENT_ACTIONS.SAVE_CHILD_EVENTS
);
const saveChildrenEvents = createAction<MyProfileChildren | undefined>(
  EVENT_ACTIONS.SAVE_CHILDREN_EVENTS
);

export { clearEvent, saveChildEvents, saveChildrenEvents };
