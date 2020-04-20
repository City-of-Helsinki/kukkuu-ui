import { createReducer } from '@reduxjs/toolkit';

import { EVENT_ACTIONS } from '../constants/EventActionConstants';

export default createReducer(false, {
  [EVENT_ACTIONS.JUST_ENROLLED]: (state) => !state,
});
