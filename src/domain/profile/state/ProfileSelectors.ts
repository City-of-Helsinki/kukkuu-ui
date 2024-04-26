import { StoreState } from '../../app/types/AppTypes';

/** @deprecated in favor of GuardianProvider */
export const profileSelector = (state: StoreState) => state.profile;
/** @deprecated in favor of GuardianProvider */
export const profileChildrenSelector = (state: StoreState) =>
  state.profile.children;
