import { createReducer } from '@reduxjs/toolkit';

import { RegistrationData } from '../types/RegistrationTypes';
import {
  resetFormValues,
  setFormValues,
  setHomeFormValues,
} from './RegistrationActions';

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

const reducer = createReducer(defaultRegistrationData, (builder) => {
  builder
    .addCase(setFormValues, (state, action) => ({
      ...state,
      formValues: action.payload,
    }))
    .addCase(resetFormValues, (state) => ({
      ...state,
      formValues: defaultRegistrationData.formValues,
    }))
    .addCase(setHomeFormValues, (state, action) => ({
      ...state,
      formValues: {
        ...state.formValues,
        children: [
          {
            ...state.formValues.children[0],
            birthdate: action.payload.child.birthdate,
            homeCity: action.payload.child.homeCity,
          },
          ...state.formValues.children.slice(1),
        ],
        verifyInformation: action.payload.verifyInformation,
      },
    }));
});

export default reducer;
