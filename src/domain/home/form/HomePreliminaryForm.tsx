import React, { FunctionComponent, Ref } from 'react';
import { Formik, Form } from 'formik';
import { connect } from 'react-redux';
import { useTranslation, Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { CheckboxProps, useOidcClient } from 'hds-react';

import styles from './homePreliminaryForm.module.scss';
import { isChildEligible } from '../../registration/notEligible/NotEligibleUtils';
import { setHomeFormValues } from '../../registration/state/RegistrationActions';
import { RegistrationFormValues } from '../../registration/types/RegistrationTypes';
import { StoreState } from '../../app/types/AppTypes';
import { HomeFormValues, HomeFormPayload } from './types/HomeFormTypes';
import { registrationFormDataSelector } from '../../registration/state/RegistrationSelectors';
import Button from '../../../common/components/button/Button';
import CheckboxField from '../../../common/components/form/fields/checkbox/CheckboxField';
import FormikTextInput from '../../../common/components/formikWrappers/FormikTextInput';
import useGetPathname from '../../../common/route/utils/useGetPathname';
import { SUPPORTED_START_BIRTH_YEAR } from '../../../common/time/TimeConstants';

interface Props {
  isAuthenticated: boolean;
  setHomeFormValues: (values: HomeFormPayload) => void;
  // eslint-disable-next-line react/no-unused-prop-types
  stateFormValues: RegistrationFormValues;
  forwardRef: Ref<HTMLDivElement>;
}

const HomePreliminaryForm: FunctionComponent<Props> = ({
  setHomeFormValues,
  isAuthenticated,
  forwardRef,
}) => {
  const { login } = useOidcClient();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const getPathname = useGetPathname();
  const [
    isRegistrationInformationVerified,
    setIsRegistrationInformationVerified,
  ] = React.useState(false);

  const onChangeRegistrationInformationVerified: CheckboxProps['onChange'] = (
    event
  ) => setIsRegistrationInformationVerified(event.currentTarget.checked);
  const schema = yup.object().shape({
    verifyInformation: yup.boolean().required('validation.general.required'),
    child: yup.object().shape({
      homeCity: yup.string().required('validation.general.required'),
      birthyear: yup
        .number()
        .required('validation.general.required')
        .min(SUPPORTED_START_BIRTH_YEAR, 'validation.date.unSupported')
        .max(new Date().getFullYear(), 'validation.date.unSupported'),
    }),
  });

  const handleSubmit = (values: HomeFormValues) => {
    if (values.child) {
      const payload: HomeFormPayload = {
        child: {
          birthyear: values.child.birthyear,
          homeCity: values.child.homeCity,
        },
        verifyInformation: values.verifyInformation,
      };
      setHomeFormValues(payload);
      handleRedirect(payload);
    }
  };

  const handleRedirect = (payload: HomeFormPayload) => {
    if (!isChildEligible(payload.child)) {
      navigate(getPathname('/registration/not-eligible'));
    } else if (isAuthenticated) {
      navigate(getPathname('/registration/form'));
    } else {
      login({ url_state: 'next=/registration/form' });
    }
  };

  return (
    <section id="register" className={styles.wrapper} ref={forwardRef}>
      <div className={styles.homeForm}>
        <div className={styles.heading}>
          <h2>{t('registration.heading')}</h2>
          <p>
            <Trans i18nKey="multiline">{t('home.registration.text')}</Trans>
          </p>
        </div>
        <Formik
          initialValues={{ verifyInformation: false }}
          onSubmit={handleSubmit}
          validationSchema={schema}
        >
          {({ isSubmitting }) => {
            return (
              <Form noValidate id="homePageForm">
                <div className={styles.inputWrapper}>
                  <FormikTextInput
                    type="number"
                    name="child.birthyear"
                    id="child.birthyear"
                    label={t(
                      'homePage.preliminaryForm.childBirthyear.input.year.placeholder'
                    )}
                    required={true}
                    placeholder={t(
                      'homePage.preliminaryForm.childBirthyear.input.year.placeholder'
                    )}
                  />
                  <FormikTextInput
                    name="child.homeCity"
                    id="child.homeCity"
                    label={t(
                      'homePage.preliminaryForm.childHomeCity.input.label'
                    )}
                    required={true}
                    placeholder={t(
                      'homePage.preliminaryForm.childHomeCity.input.placeholder'
                    )}
                  />
                </div>
                <CheckboxField
                  name="verifyInformation"
                  id="verifyInformation"
                  label={t(
                    'homePage.preliminaryForm.verifyInformation.checkbox.label'
                  )}
                  onChange={onChangeRegistrationInformationVerified}
                  required
                />
                <Button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isSubmitting || !isRegistrationInformationVerified}
                >
                  {t('homePage.hero.buttonText')}
                </Button>
              </Form>
            );
          }}
        </Formik>
      </div>
    </section>
  );
};

const actions = {
  setHomeFormValues,
};

const mapStateToProps = (state: StoreState) => {
  const stateFormData = registrationFormDataSelector(state);
  return {
    stateFormValues: stateFormData,
  };
};

export const UnconnectedHomePreliminaryForm = HomePreliminaryForm;

export default connect(mapStateToProps, actions)(HomePreliminaryForm);
