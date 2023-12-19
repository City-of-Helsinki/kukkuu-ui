import { createAction } from '@reduxjs/toolkit';

import { ChildOccurrences } from '../type/EventChildTypes';
import { EVENT_ACTIONS } from '../constants/EventActionConstants';
import { ProfileQuery } from '../../api/generatedTypes/graphql';

type Children = NonNullable<ProfileQuery['myProfile']>['children'];

const clearEvent = createAction(EVENT_ACTIONS.CLEAR_EVENT);
const saveChildEvents = createAction<ChildOccurrences>(
  EVENT_ACTIONS.SAVE_CHILD_EVENTS
);
const saveChildrenEvents = createAction<Children | undefined>(
  EVENT_ACTIONS.SAVE_CHILDREN_EVENTS
);
const justEnrolled = createAction(EVENT_ACTIONS.JUST_ENROLLED);

export { clearEvent, saveChildEvents, saveChildrenEvents, justEnrolled };
