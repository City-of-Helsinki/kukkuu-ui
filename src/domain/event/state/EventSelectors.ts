import { StoreState } from '../../app/types/AppTypes';

export const childrenEventSelector = (state: StoreState) => {
  return state.event;
};

// Whether to show the success toast or not
export const justEnrolledSelector = (state: StoreState) => {
  return state.enrolled;
};
