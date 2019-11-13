import React, { FunctionComponent } from 'react';
import { Formik, Field, FieldArray, FormikErrors } from 'formik';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { loginTunnistamo } from '../../auth/authenticate';
import styles from './homePreliminaryForm.module.scss';
import Button from '../../../common/components/button/Button';
import InputField from '../../../common/components/form/fields/input/InputField';
import {
  validateRequire,
  validateBirthdate,
} from '../../../common/components/form/validationUtils';
import BirthdateFormField from './partial/BirthdateFormField';
import { setFormValues } from '../../registration/state/RegistrationActions';
import { RegistrationFormValues } from '../../registration/types/RegistrationTypes';
import { defaultRegistrationData } from '../../registration/state/RegistrationReducers';
import { StoreState } from '../../app/types/AppTypes';
import { isAuthenticatedSelector } from '../../auth/state/AuthenticationSelectors';
import { HomeFormValues } from './types/HomeFormTypes';
import { convertFormValues } from './HomePreliminaryFormUtils';

interface Props {
  isAuthenticated: boolean;
  setFormValues: (values: RegistrationFormValues) => void;
  stateFormValues: RegistrationFormValues;
}

const HomePreliminaryForm: FunctionComponent<Props> = ({
  setFormValues,
  stateFormValues,
  isAuthenticated,
}) => {
  const { t } = useTranslation();
  const history = useHistory();

  const handleSubmit = (values: HomeFormValues) => {
    const defaultFormValues = defaultRegistrationData.formValues;
    const payload = Object.assign({}, defaultFormValues, {
      child: {
        birthdate: `${values.child.birthdate.day}.${values.child.birthdate.month}.${values.child.birthdate.year}`,
        homeCity: values.child.homeCity,
      },
      verifyInformation: values.verifyInformation,
    });

    setFormValues(payload);
    if (isAuthenticated) history.push('/registration/form');
    else loginTunnistamo(`/registration/form`);
  };

  const validate = (values: HomeFormValues) => {
    const {
      child: {
        birthdate: { day, month, year },
      },
    } = values;
    const errors: FormikErrors<HomeFormValues> = {};

    if (day && month && year) {
      errors.childBirthdate = validateBirthdate(`${day}.${month}.${year}`);

      if (!errors.childBirthdate) {
        // Delete the property manually so form will be valid when this is undefined.
        delete errors.childBirthdate;
      }
    }
    return errors;
  };
  return (
    <div className={styles.homeForm}>
      <Formik
        initialValues={convertFormValues(stateFormValues)}
        onSubmit={handleSubmit}
        validate={validate}
      >
        {({ values, handleChange, handleSubmit, isSubmitting, isValid }) => (
          <form onSubmit={handleSubmit}>
            <div className={styles.inputWrapper}>
              <FieldArray
                name="child.birthdate"
                render={props => <BirthdateFormField {...props} />}
              />

              <Field
                className={styles.childHomeCity}
                type="text"
                name="child.homeCity"
                label={t('homePage.preliminaryForm.childHomeCity.input.label')}
                onChange={handleChange}
                value={values.child.homeCity}
                component={InputField}
                placeholder={t(
                  'homePage.preliminaryForm.childHomeCity.input.placeholder'
                )}
              />
            </div>

            <Field
              className={styles.verifyInformationCheckbox}
              type="checkbox"
              label={t(
                'homePage.preliminaryForm.verifyInformation.checkbox.label'
              )}
              name="verifyInformation"
              onChange={handleChange}
              value={values.verifyInformation}
              checked={values.verifyInformation}
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
              {t('homePage.hero.buttonText')}
            </Button>
          </form>
        )}
      </Formik>
    </div>
  );
};

const actions = {
  setFormValues,
};

const mapStateToProps = (state: StoreState) => ({
  isAuthenticated: isAuthenticatedSelector(state),
  stateFormValues: state.registration.formValues,
});

export const UnconnectedHomePreliminaryForm = HomePreliminaryForm;

export default connect(
  mapStateToProps,
  actions
)(HomePreliminaryForm);
