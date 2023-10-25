import { createAction, createReducer } from '@reduxjs/toolkit';
import { SILENT_RENEW_ERROR } from 'redux-oidc';

import { UIData } from '../../types/ui/UITypes';
import {
  closeExpiredSessionPrompt,
  resetUIState,
  showExpiredSessionPrompt,
} from './UIActions';

export const defaultUIState: UIData = {
  sessionExpiredPrompt: {
    isOpen: false,
  },
};
const silentRenewError = createAction(SILENT_RENEW_ERROR);
const reducer = createReducer(defaultUIState, (builder) => {
  builder
    .addCase(silentRenewError, (state) => ({
      ...state,
      sessionExpiredPrompt: {
        ...state.sessionExpiredPrompt,
        isOpen: true,
      },
    }))
    .addCase(showExpiredSessionPrompt, (state) => ({
      ...state,
      sessionExpiredPrompt: {
        ...state.sessionExpiredPrompt,
        isOpen: true,
      },
    }))
    .addCase(closeExpiredSessionPrompt, (state) => ({
      ...state,
      sessionExpiredPrompt: {
        ...state.sessionExpiredPrompt,
        isOpen: false,
      },
    }))
    .addCase(resetUIState, () => ({
      ...defaultUIState,
    }));
});

export default reducer;
