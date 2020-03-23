import { StoreState } from '../../app/types/AppTypes';

export const profileSelector = (state: StoreState) => state.profile;
export const profileChildrenSelector = (state: StoreState) =>
  state.profile.children;
export const childByIdSelector = (state: StoreState, childId: string) => {
  return state.profile.children.edges.find(
    (child) => child?.node?.id === childId
  );
};
