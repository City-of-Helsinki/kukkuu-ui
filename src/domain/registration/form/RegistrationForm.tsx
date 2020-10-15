import React, { FunctionComponent, useState } from 'react';
import { Formik, FormikProps, FieldArray } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation, useQuery } from '@apollo/client';
import { useTranslation, Trans } from 'react-i18next';
import { useHistory, Redirect } from 'react-router-dom';
import classnames from 'classnames';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/browser';
import { IconPlusCircle } from 'hds-react';
import * as yup from 'yup';

import styles from './registrationForm.module.scss';
import submitChildrenAndGuardianMutation from '../mutations/submitChildrenAndGuardianMutation';
import { resetFormValues, setFormValues } from '../state/RegistrationActions';
import { initialFormDataSelector } from './RegistrationFormSelectors';
import { SUPPORT_LANGUAGES } from '../../../common/translation/TranslationConstants';
import AddNewChildFormModal from '../modal/AddNewChildFormModal';
import Icon from '../../../common/components/icon/Icon';
import happyAdultIcon from '../../../assets/icons/svg/adultFaceHappy.svg';
import PageWrapper from '../../app/layout/PageWrapper';
import { getCurrentLanguage } from '../../../common/translation/TranslationUtils';
import { getSupportedChildData } from '../../child/ChildUtils';
// eslint-disable-next-line max-len
import { submitChildrenAndGuardian as SubmitChildrenAndGuardianData } from '../../api/generatedTypes/submitChildrenAndGuardian';
import { saveProfile, clearProfile } from '../../profile/state/ProfileActions';
import profileQuery from '../../profile/queries/ProfileQuery';
import { profileQuery as ProfileQueryType } from '../../api/generatedTypes/profileQuery';
import LoadingSpinner from '../../../common/components/spinner/LoadingSpinner';
import NavigationConfirm from '../../../common/components/confirm/NavigationConfirm';
import { GuardianInput, Language } from '../../api/generatedTypes/globalTypes';
import FormikDropdown from '../../../common/components/formikWrappers/FormikDropdown';
import { RegistrationFormValues } from '../types/RegistrationTypes';
import Button from '../../../common/components/button/Button';
import FormikTextInput from '../../../common/components/formikWrappers/FormikTextInput';
import TermsField from '../../../common/components/form/fields/terms/TermsField';
import ChildFormFields from './partial/childFormFields';

const schema = yup.object().shape({
  guardian: yup.object().shape({
    firstName: yup
      .string()
      .required('validation.general.required')
      .max(255, 'validation.maxLength'),
    lastName: yup
      .string()
      .required('validation.general.required')
      .max(255, 'validation.maxLength'),
    email: yup
      .string()
      .email('registration.form.guardian.email.input.error')
      .required('validation.general.required'),
    phoneNumber: yup
      .string()
      .required('validation.general.required')
      .max(255, 'validation.maxLength'),
    language: yup.string().max(255, 'validation.maxLength'),
  }),
  children: yup.array().of(
    yup.object().shape({
      postalCode: yup
        .string()
        .required('validation.general.required')
        .length(5, 'registration.form.child.postalCode.input.error.length')
        .matches(/\b\d{5}\b/g, 'validation.postalCode.invalidFormat'),
      relationship: yup.object().shape({
        type: yup.string().required('validation.general.required').nullable(),
      }),
    })
  ),
  agree: yup.boolean().oneOf([true], 'validation.general.required'),
});

const RegistrationForm: FunctionComponent = () => {
  const { i18n, t } = useTranslation();
  const currentLocale = getCurrentLanguage(i18n);
  const history = useHistory();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const initialValues = useSelector(initialFormDataSelector);
  const { loading, error, data } = useQuery<ProfileQueryType>(profileQuery);
  const [submitChildrenAndGuardian] = useMutation<
    SubmitChildrenAndGuardianData
  >(submitChildrenAndGuardianMutation, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: profileQuery }],
  });
  // For new users preferLanguage defaults to their chosen UI language.
  // FIXME or ignore: If you have the form open for a long time, and silent renew fails, you get a error from redux:
  // Invariant failed: A state mutation was detected between dispatches, in the path 'registration.formValues.preferLanguage'.
  initialValues.preferLanguage = initialValues.preferLanguage || currentLocale;

  // isFilling is true when user has started filling out the form.
  // They will lose all their local form state if they change URL
  // or reload the page unless they submit first.
  const [isFilling, setFormIsFilling] = useState(false);

  if (loading) return <LoadingSpinner isLoading={true} />;
  if (!data || error) {
    dispatch(clearProfile());
  }
  if (data?.myProfile) {
    // No need to save profile here, that will be done after the redirect
    return <Redirect to="/profile" />;
  }

  return (
    <PageWrapper
      className={styles.grayBackground}
      title={'registration.heading'}
    >
      <NavigationConfirm
        isHalfFilling={isFilling}
        warningMessage={t('common.form.leave.warning.text')}
      />

      <div className={styles.registrationFormContainer}>
        <div className={styles.registrationForm}>
          <Formik
            initialValues={initialValues}
            validationSchema={schema}
            validate={() => {
              if (!isFilling) {
                setFormIsFilling(true);
              }
            }}
            onSubmit={(values: RegistrationFormValues) => {
              setFormIsFilling(false);
              dispatch(setFormValues(values));

              const backendSupportChildren = values.children.map((child) =>
                getSupportedChildData(child)
              );

              // Convert from language as a string ('fi', 'en') to the corresponding enum
              const language: Language =
                Language[
                  values.preferLanguage.toUpperCase() as keyof typeof Language
                ];

              const backendSupportGuardian: GuardianInput = {
                firstName: values.guardian.firstName,
                lastName: values.guardian.lastName,
                email: values.guardian.email,
                phoneNumber: values.guardian.phoneNumber,
                language: language,
              };

              submitChildrenAndGuardian({
                variables: {
                  children: backendSupportChildren,
                  guardian: backendSupportGuardian,
                },
              })
                .then((response) => {
                  if (response.data?.submitChildrenAndGuardian?.guardian) {
                    dispatch(
                      saveProfile(
                        response.data?.submitChildrenAndGuardian?.guardian
                      )
                    );
                  }
                  dispatch(resetFormValues());
                  history.push('/registration/success');
                })
                .catch((error) => {
                  toast.error(t('registration.submitMutation.errorMessage'));
                  Sentry.captureException(error);
                });
            }}
          >
            {({
              values,
              isSubmitting,
              handleSubmit,
              setFieldValue,
              setFieldTouched,
              errors,
              touched,
            }: FormikProps<RegistrationFormValues>) => (
              <form onSubmit={handleSubmit} id="registrationForm">
                <div className={styles.registrationGrayContainer}>
                  <h1>{t('registration.heading')}</h1>
                </div>

                <div
                  className={classnames(
                    styles.childrenInfo,
                    styles.registrationWhiteContainer
                  )}
                >
                  <FieldArray
                    name="children"
                    render={(arrayHelpers) => {
                      return (
                        <>
                          {isOpen && (
                            <AddNewChildFormModal
                              setIsOpen={setIsOpen}
                              addChild={(payload) => {
                                // When user add child first instead of other input
                                // validate wont be invoked -> isFilling still false but
                                // user do have unfinished work
                                // this function was invoked here to make sure in that case
                                setFormIsFilling(true);
                                arrayHelpers.push(payload);
                              }}
                            />
                          )}
                          {values.children &&
                            values.children.map((child, index) => (
                              <ChildFormFields
                                key={index}
                                arrayHelpers={arrayHelpers}
                                child={child}
                                childIndex={index}
                                setFieldValue={setFieldValue}
                                errors={errors}
                                touched={touched}
                                setFieldTouched={setFieldTouched}
                              />
                            ))}
                        </>
                      );
                    }}
                  />
                </div>
                <div className={styles.registrationGrayContainer}>
                  <Button
                    variant="supplementary"
                    aria-label={t('child.form.modal.add.label')}
                    className={styles.addNewChildButton}
                    iconLeft={<IconPlusCircle />}
                    onClick={() => setIsOpen(true)}
                  >
                    {t('child.form.modal.add.label')}
                  </Button>
                </div>
                <div
                  className={classnames(
                    styles.guardianInfo,
                    styles.registrationWhiteContainer
                  )}
                >
                  <div className={styles.heading}>
                    <Icon src={happyAdultIcon} className={styles.childImage} />
                    <h2>{t('registration.form.guardian.info.heading')}</h2>
                  </div>
                  <FormikTextInput
                    id="guardian.email"
                    name="guardian.email"
                    required={true}
                    label={t('registration.form.guardian.email.input.label')}
                    placeholder={t(
                      'registration.form.guardian.email.input.placeholder'
                    )}
                  />
                  <FormikTextInput
                    id="guardian.phoneNumber"
                    name="guardian.phoneNumber"
                    required={true}
                    label={t(
                      'registration.form.guardian.phoneNumber.input.label'
                    )}
                    placeholder={t(
                      'registration.form.guardian.phoneNumber.input.placeholder'
                    )}
                  />
                  <div className={styles.guardianName}>
                    <FormikTextInput
                      required={true}
                      id="guardian.firstName"
                      name="guardian.firstName"
                      label={t(
                        'registration.form.guardian.firstName.input.label'
                      )}
                      placeholder={t(
                        'registration.form.guardian.firstName.input.placeholder'
                      )}
                    />
                    <FormikTextInput
                      required={true}
                      id="guardian.lastName"
                      name="guardian.lastName"
                      label={t(
                        'registration.form.guardian.lastName.input.label'
                      )}
                      placeholder={t(
                        'registration.form.guardian.lastName.input.placeholder'
                      )}
                    />
                  </div>

                  <FormikDropdown
                    id="preferLanguage"
                    name="preferLanguage"
                    value={values.preferLanguage}
                    label={t('registration.form.guardian.language.input.label')}
                    required={true}
                    options={[
                      {
                        label: t('common.language.en'),
                        value: SUPPORT_LANGUAGES.EN,
                      },
                      {
                        label: t('common.language.fi'),
                        value: SUPPORT_LANGUAGES.FI,
                      },
                      {
                        label: t('common.language.sv'),
                        value: SUPPORT_LANGUAGES.SV,
                      },
                    ]}
                    placeholder={t(
                      'registration.form.guardian.language.input.placeholder'
                    )}
                  />
                  <TermsField
                    className={styles.agreeBtn}
                    type="checkbox"
                    id="agree"
                    name="agree"
                    required={true}
                    label={
                      <Trans
                        i18nKey="registration.form.agree.input.label"
                        components={[
                          // These components receive content in the
                          // translation definition.
                          // eslint-disable-next-line jsx-a11y/anchor-has-content
                          <a
                            href={t('descriptionOfTheFile.url')}
                            target="_blank"
                            rel="noopener noreferrer"
                          />,
                          // eslint-disable-next-line jsx-a11y/anchor-has-content
                          <a
                            href={t('dataProtection.url')}
                            target="_blank"
                            rel="noopener noreferrer"
                          />,
                        ]}
                      />
                    }
                  />

                  <Button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isSubmitting}
                  >
                    {t('homePage.hero.buttonText')}
                  </Button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </PageWrapper>
  );
};

export default RegistrationForm;
