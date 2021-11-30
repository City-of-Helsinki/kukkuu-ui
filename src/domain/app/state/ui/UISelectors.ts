import { StoreState } from '../../types/AppTypes';

export const isSessionExpiredPromptOpenSelector = (state: StoreState) =>
  state.ui.sessionExpiredPrompt.isOpen;
