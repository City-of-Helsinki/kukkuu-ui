import React, { Component } from 'react';
import { Formik, Field, FieldArray, FormikErrors } from 'formik';
import { connect } from 'react-redux';

import authenticate from '../../auth/authenticate';
import styles from './homePreliminaryForm.module.scss';
import { formatMessage } from '../../../common/translation/utils';
import Button from '../../../common/components/button/Button';
import InputField from '../../../common/components/form/fields/input/InputField';
import {
  validateEqual,
  validateRequire,
  validateBirthday,
} from '../../../common/components/form/validationUtils';
import BirthdayFormField from './partial/BirthdayFormField';
import { setFormValues } from '../../registration/state/RegistrationActions';
import { RegistrationFormValues } from '../../registration/types/RegistrationTypes';
import { defaultRegistrationData } from '../../registration/state/RegistrationReducers';
import { StoreState } from '../../app/types/stateTypes';
import { DEFAULT_DATE_FORMAT } from '../../../common/time/TimeConstants';
import { newMoment } from '../../../common/time/utils';

interface HomeFormValues {
  child: {
    birthday: {
      day: string | number;
      month: string | number;
      year: string | number;
    };
    homeCity: string;
  };
  verifyInformation: boolean;
  childBirthday?: string;
}

interface Props {
  setFormValues: (values: RegistrationFormValues) => void;
  submittedFormValues: RegistrationFormValues;
}

class HomePreliminaryForm extends Component<Props> {
  initialFormValues = () => {
    // submittedFormValues: HomeFormValues = {
    //   verifyInformation: false,
    // };
    let values: HomeFormValues = {
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
    if (this.props.submittedFormValues) {
      const day = newMoment(
        this.props.submittedFormValues.child.birthday,
        DEFAULT_DATE_FORMAT
      );
      if (day.isValid()) {
        values = {
          child: {
            birthday: {
              day: day.date(),
              month: day.month() + 1,
              year: day.year(),
            },
            homeCity: this.props.submittedFormValues.child.homeCity,
          },
          verifyInformation: this.props.submittedFormValues.verifyInformation,
        };
      }
    }
    return values;
  };

  handleSubmit = (values: HomeFormValues) => {
    const { setFormValues } = this.props;

    const defaultFormValues = defaultRegistrationData.formValues;
    const payload = Object.assign({}, defaultFormValues, {
      child: {
        birthday: `${values.child.birthday.day}.${values.child.birthday.month}.${values.child.birthday.year}`,
        homeCity: values.child.homeCity,
      },
      verifyInformation: values.verifyInformation,
    });

    setFormValues(payload);
    authenticate();
  };

  validate = (values: HomeFormValues) => {
    const {
      child: {
        birthday: { day, month, year },
      },
    } = values;
    const errors: FormikErrors<HomeFormValues> = {};

    if (day && month && year) {
      errors.childBirthday = validateBirthday(`${day}.${month}.${year}`);

      if (!errors.childBirthday) {
        // Delete the property manually so form will be valid when this is undefined.
        delete errors.childBirthday;
      }
    }
    return errors;
  };

  render() {
    const initialValues: HomeFormValues = this.initialFormValues();
    return (
      <div className={styles.homeForm}>
        <Formik
          initialValues={initialValues}
          onSubmit={this.handleSubmit}
          validate={this.validate}
        >
          {({ values, handleChange, handleSubmit, isSubmitting, isValid }) => (
            <form onSubmit={handleSubmit}>
              <div className={styles.inputWrapper}>
                <FieldArray
                  name="child.birthday"
                  render={props => <BirthdayFormField {...props} />}
                />

                <Field
                  className={styles.childHomeCity}
                  type="text"
                  name="child.homeCity"
                  label={formatMessage(
                    'homePage.preliminaryForm.childHomeCity.input.label'
                  )}
                  onChange={handleChange}
                  value={values.child.homeCity}
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
                checked={values.verifyInformation}
                component={InputField}
                validate={(value: boolean) =>
                  validateRequire(
                    value,
                    formatMessage(
                      'homePage.preliminaryForm.verifyInformation.checkbox.required.label'
                    )
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
        </Formik>
      </div>
    );
  }
}

const actions = {
  setFormValues,
};

const mapStateToProps = (state: StoreState) => ({
  //isAuthenticated: isAuthenticatedSelector(state),
  submittedFormValues: state.registration.formValues,
});

export const UnconnectedHomePreliminaryForm = HomePreliminaryForm;

export default connect(
  mapStateToProps,
  actions
)(HomePreliminaryForm);
