import { createReducer } from 'redux-starter-kit';

import { RegistrationData } from '../types/RegistrationTypes';
import { REGISTRATION_ACTIONS } from '../constants/RegistrationActionConstants';

export const defaultRegistrationData: RegistrationData = {
  formValues: {
    child: {
      birthday: '',
      firstName: '',
      homeCity: '',
      lastName: '',
    },
    guardian: {
      email: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      relationship: '',
    },
    verifyInformation: false,
  },
};

export default createReducer(defaultRegistrationData, {
  [REGISTRATION_ACTIONS.SET_FORM_VALUES]: (state, action) =>
    Object.assign({}, state, { formValues: action.payload }),
  [REGISTRATION_ACTIONS.RESET_FORM_VALUES]: state =>
    Object.assign({}, state, {
      formValues: defaultRegistrationData.formValues,
    }),
});
