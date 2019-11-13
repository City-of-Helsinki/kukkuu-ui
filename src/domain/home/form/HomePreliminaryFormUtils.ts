import { get } from 'lodash';

import { RegistrationFormValues } from '../../registration/types/RegistrationTypes';
import { DEFAULT_DATE_FORMAT } from '../../../common/time/TimeConstants';
import { newMoment } from '../../../common/time/utils';
import { HomeFormValues } from './types/HomeFormTypes';

/**
 * Convert FormValues fetched from state to initialValues used by formik
 * @param {RegistrationFormValues} stateFormValues Values from state.
 * @returns {HomeFormValues} initialValues used in form.
 */
export const convertFormValues = (
  stateFormValues: RegistrationFormValues
): HomeFormValues => {
  if (get(stateFormValues, 'child.birthdate')) {
    const birthdateMoment = newMoment(
      stateFormValues.child.birthdate,
      DEFAULT_DATE_FORMAT
    );
    return {
      child: {
        birthdate: {
          day: birthdateMoment.date(),
          month: birthdateMoment.month() + 1,
          year: birthdateMoment.year(),
        },
        homeCity: stateFormValues.child.homeCity,
      },
      verifyInformation: stateFormValues.verifyInformation,
    };
  }
  return {
    child: {
      birthdate: {
        day: '',
        month: '',
        year: '',
      },
      homeCity: '',
    },
    verifyInformation: false,
  };
};
