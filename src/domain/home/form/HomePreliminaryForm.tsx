import React, { FunctionComponent } from 'react';
import { Formik, Field, FormikErrors } from 'formik';
import { connect } from 'react-redux';

import authenticate from '../../auth/authenticate';
import styles from './homePreliminaryForm.module.scss';
import { formatMessage } from '../../../common/translation/utils';
import Button from '../../../common/components/button/Button';
import InputField from '../../../common/components/form/fields/input/InputField';
import {
  validateEqual,
  validateBirthDay,
  validateRequire,
} from '../../../common/components/form/validationUtils';
import BirthdayFormField from './partial/BirthdayFormField';
import { setFormValues } from '../../registration/state/RegistrationActions';
import { RegistrationFormValues } from '../../registration/types/RegistrationTypes';
import { StoreState } from '../../app/types/stateTypes';
import { DEFAULT_DATE_FORMAT } from '../../../common/time/constants';
import { newMoment } from '../../../common/time/utils';

interface HomeFormValues {
  childBirthdayDay: number | string;
  childBirthdayMonth: number | string;
  childBirthdayYear: number | string;
  childHomeCity: string;
  verifyInformation: boolean;
  childBirthday?: string;
}

interface Props {
  setFormValues: (values: RegistrationFormValues) => void;
  submittedFormValues: RegistrationFormValues;
}

const validate = (values: HomeFormValues) => {
  const errors: FormikErrors<HomeFormValues> = {};

  if (
    values.childBirthdayDay &&
    values.childBirthdayMonth &&
    values.childBirthdayYear
  ) {
    errors.childBirthday = validateBirthDay(
      `${values.childBirthdayDay}.${values.childBirthdayMonth}.${values.childBirthdayYear}`
    );

    if (!errors.childBirthday) {
      // Delete the property manually so form will be valid when this is undefined.
      delete errors.childBirthday;
    }
  }

  return errors;
};
const HomePreliminaryForm: FunctionComponent<Props> = props => {
  const day = newMoment(
    props.submittedFormValues.childBirthday,
    DEFAULT_DATE_FORMAT
  );

  const submittedFormValues: HomeFormValues = {
    childBirthday: props.submittedFormValues.childBirthday,
    childBirthdayDay: day.date(),
    childBirthdayMonth: day.month() + 1,
    childBirthdayYear: day.year(),
    childHomeCity: props.submittedFormValues.childHomeCity,
    verifyInformation: false,
  };

  return (
    <div className={styles.homeForm}>
      <Formik
        initialValues={{
          childBirthdayDay: submittedFormValues.childBirthdayDay || '',
          childBirthdayMonth: submittedFormValues.childBirthdayMonth || '',
          childBirthdayYear: submittedFormValues.childBirthdayYear || '',
          childHomeCity: submittedFormValues.childHomeCity || '',
          verifyInformation: false,
        }}
        onSubmit={(values: HomeFormValues) => {
          props.setFormValues({
            childBirthday: `${values.childBirthdayDay}.${values.childBirthdayMonth}.${values.childBirthdayYear}`,
            childHomeCity: values.childHomeCity,
            verifyInformation: values.verifyInformation,
          });
          authenticate();
        }}
        validate={validate}
        render={({
          values,
          handleChange,
          handleSubmit,
          isSubmitting,
          isValid,
          errors,
        }) => (
          <form onSubmit={handleSubmit}>
            <div className={styles.inputWrapper}>
              <BirthdayFormField error={errors.childBirthday} />

              <Field
                className={styles.childHomeCity}
                type="text"
                name="childHomeCity"
                label={formatMessage(
                  'homePage.preliminaryForm.childHomeCity.input.label'
                )}
                onChange={handleChange}
                value={values.childHomeCity}
                component={InputField}
                placeholder={formatMessage(
                  'homePage.preliminaryForm.childHomeCity.input.placeholder'
                )}
                validate={(value: string | number) =>
                  validateEqual(
                    value,
                    formatMessage(
                      'homePage.preliminaryForm.childHomeCity.supportCity'
                    ),
                    formatMessage('validation.general.unSupportedCity')
                  )
                }
              />
            </div>

            <Field
              className={styles.verifyInformationCheckbox}
              type="checkbox"
              label={formatMessage(
                'homePage.preliminaryForm.verifyInformation.checkbox.label'
              )}
              name="verifyInformation"
              onChange={handleChange}
              value={values.verifyInformation}
              component={InputField}
              validate={(value: boolean) =>
                validateRequire(
                  value,
                  'homePage.preliminaryForm.verifyInformation.checkbox.required.label'
                )
              }
            />

            <Button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting || !isValid}
            >
              {formatMessage('homePage.hero.buttonText')}
            </Button>
          </form>
        )}
      />
    </div>
  );
};

const actions = {
  setFormValues,
};

export const UnconnectedHomePreliminaryForm = HomePreliminaryForm;

const mapStateToProps = (state: StoreState) => ({
  //isAuthenticated: isAuthenticatedSelector(state),
  submittedFormValues: state.registration.formValues,
});

export default connect(
  mapStateToProps,
  actions
)(HomePreliminaryForm);
