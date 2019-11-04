import { StoreState } from '../../app/types/stateTypes';

export const registrationFormDataSelector = (state: StoreState) =>
  state.registration.formValues;
