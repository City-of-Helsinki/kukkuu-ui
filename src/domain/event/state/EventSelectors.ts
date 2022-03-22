import { StoreState } from '../../app/types/AppTypes';

// Whether to show the success toast or not
export const justEnrolledSelector = (state: StoreState) => {
  return state.enrolled;
};
