import { createReducer } from '@reduxjs/toolkit';

import { UI_ACTIONS } from './UIActionsConstants';
import { UIData } from '../../types/ui/UITypes';

export const defaultUIState: UIData = {
  sessionExpiredPrompt: {
    isOpen: false,
  },
};

export default createReducer(defaultUIState, {
  [UI_ACTIONS.SESSION_EXPIRED_PROMPT.SHOW]: (state) => {
    state.sessionExpiredPrompt.isOpen = true;
  },
  [UI_ACTIONS.SESSION_EXPIRED_PROMPT.CLOSE]: (state, action) => {
    state.sessionExpiredPrompt.isOpen = false;
  },
  [UI_ACTIONS.RESET_UI_STATE]: (state) => (state = defaultUIState),
});
