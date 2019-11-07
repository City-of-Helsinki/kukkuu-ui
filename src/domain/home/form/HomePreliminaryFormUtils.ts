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
  if (get(stateFormValues, 'child.birthday')) {
    const birthdayMoment = newMoment(
      stateFormValues.child.birthday,
      DEFAULT_DATE_FORMAT
    );
    return {
      child: {
        birthday: {
          day: birthdayMoment.date(),
          month: birthdayMoment.month() + 1,
          year: birthdayMoment.year(),
        },
        homeCity: stateFormValues.child.homeCity,
      },
      verifyInformation: stateFormValues.verifyInformation,
    };
  }
  return {
    child: {
      birthday: {
        day: '',
        month: '',
        year: '',
      },
      homeCity: '',
    },
    verifyInformation: false,
  };
};
