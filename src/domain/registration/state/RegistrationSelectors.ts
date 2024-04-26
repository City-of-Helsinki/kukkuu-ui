import { StoreState } from '../../app/types/AppTypes';

export const registrationFormDataSelector = (state: StoreState) =>
  state.registration.formValues;

export const primaryChildFormDataSelector = (state: StoreState) =>
  state.registration.formValues.children[0];
