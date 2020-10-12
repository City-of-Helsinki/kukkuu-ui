import { createReducer } from '@reduxjs/toolkit';

import { REGISTRATION_ACTIONS } from '../constants/RegistrationActionConstants';
import { RegistrationData } from '../types/RegistrationTypes';

export const defaultRegistrationData: RegistrationData = {
  formValues: {
    children: [
      {
        birthdate: '',
        firstName: '',
        homeCity: '',
        lastName: '',
        postalCode: '',
        relationship: { type: null },
      },
    ],
    guardian: {
      email: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      languagesSpokenAtHome: [],
    },
    preferLanguage: '',
    agree: false,
    verifyInformation: false,
  },
};

export default createReducer(defaultRegistrationData, {
  [REGISTRATION_ACTIONS.SET_FORM_VALUES]: (state, action) => {
    state.formValues = action.payload;
  },
  [REGISTRATION_ACTIONS.RESET_FORM_VALUES]: (state) => {
    state.formValues = defaultRegistrationData.formValues;
  },
  [REGISTRATION_ACTIONS.SET_HOME_FORM_VALUES]: (state, action) => {
    state.formValues.children[0].birthdate = action.payload.child.birthdate;
    state.formValues.children[0].homeCity = action.payload.child.homeCity;
    state.formValues.verifyInformation = action.payload.verifyInformation;
  },
});
