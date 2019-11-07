import { StoreState } from '../../app/types/AppTypes';

export const registrationFormDataSelector = (state: StoreState) =>
  state.registration.formValues;
