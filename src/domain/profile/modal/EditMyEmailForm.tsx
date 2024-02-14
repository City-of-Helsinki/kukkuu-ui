import * as React from 'react';
import { Formik, FormikProps, FormikErrors, Form, FormikHelpers } from 'formik';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/browser';
import * as yup from 'yup';

import styles from './editProfileModal.module.scss';
import {
  UpdateMyEmailMutationDocument,
  type UpdateMyEmailMutation,
  UpdateMyEmailMutationInput,
} from '../../api/generatedTypes/graphql';
import Button from '../../../common/components/button/Button';
import FormikTextInput from '../../../common/components/formikWrappers/FormikTextInput';
import RequestVerificationTokenButton from './RequestVerificationTokenButton';
import { EditProfileModalProps } from './EditProfileModal';

const emailChangeSchema = yup.object().shape({
  email: yup
    .string()
    .email('registration.form.guardian.email.input.error')
    .required('validation.general.required'),
  verificationToken: yup
    .string()
    .required('validation.general.required')
    .max(20, 'validation.maxLength'),
});

export default function EditMyEmailForm({
  initialValues: { email: originalEmail },
}: Pick<EditProfileModalProps, 'initialValues'>) {
  const { t } = useTranslation();

  const [isChangingEmail, setIsChangingEmail] = React.useState(false);
  const [updateMyEmail] = useMutation<UpdateMyEmailMutation>(
    UpdateMyEmailMutationDocument
  );

  const onSubmit = async (
    { email, verificationToken }: UpdateMyEmailMutationInput,
    { setFieldValue, setFieldError }: FormikHelpers<UpdateMyEmailMutationInput>
  ) => {
    try {
      await updateMyEmail({
        variables: {
          input: {
            email,
            verificationToken,
          },
        },
      });
      setIsChangingEmail(false);
      setFieldValue('verificationToken', '');
      toast.success(t('registration.submitMutation.successfulMessage'));
    } catch (error: any) {
      if (error.message.includes('token is invalid')) {
        setFieldError(
          'verificationToken',
          t('registration.form.guardian.email.verificationToken.errors.invalid')
        );
        toast.error(t('registration.form.guardian.email.errors.unsuccessful'));
      } else {
        toast.error(t('registration.submitMutation.errorMessage'));
        Sentry.captureException(error);
      }
    }
  };

  const validate = ({ email }: UpdateMyEmailMutationInput) => {
    if (!isChangingEmail) {
      setIsChangingEmail(true);
    }

    const errors: FormikErrors<UpdateMyEmailMutationInput> = {};

    if (email === originalEmail) {
      return {
        ...errors,
        email: 'registration.form.guardian.email.input.notChanged',
      };
    }
    return errors;
  };

  // Focus on email field when the email changing form is opened
  React.useEffect(() => {
    if (isChangingEmail) {
      (document.querySelector(`#email`) as HTMLInputElement)?.focus();
    }
  }, [isChangingEmail]);

  return (
    <Formik
      initialValues={{
        email: originalEmail,
        verificationToken: '',
      }}
      onSubmit={onSubmit}
      validate={validate}
      validationSchema={emailChangeSchema}
    >
      {({ isSubmitting, values }: FormikProps<UpdateMyEmailMutationInput>) => {
        const hasEmailChanged = values.email !== originalEmail;
        const shouldLockActions = isSubmitting || !hasEmailChanged;
        return (
          <Form>
            <FormikTextInput
              className={styles.formField}
              id="email"
              name="email"
              disabled={!isChangingEmail}
              label={t('registration.form.guardian.email.input.label')}
            />
            {!isChangingEmail && (
              <Button
                className={styles.emailChangeButton}
                variant="supplementary"
                onClick={() => {
                  setIsChangingEmail(true);
                }}
              >
                {t('registration.form.guardian.email.change.button')}
              </Button>
            )}

            {isChangingEmail && (
              <>
                <RequestVerificationTokenButton
                  email={values.email}
                  disabled={shouldLockActions}
                />
                <FormikTextInput
                  className={styles.formField}
                  id="verificationToken"
                  name="verificationToken"
                  label={t(
                    'registration.form.guardian.email.verificationToken.input.label'
                  )}
                  placeholder={t(
                    'registration.form.guardian.email.verificationToken.input.placeholder'
                  )}
                  helperText={t(
                    'registration.form.guardian.email.verificationToken.input.helper'
                  )}
                  autoComplete="off"
                  disabled={shouldLockActions}
                />

                <div className={styles.buttonsWrapper}>
                  <Button
                    onClick={() => setIsChangingEmail(false)}
                    variant="secondary"
                    type="button"
                    className={styles.cancelButton}
                  >
                    {t('common.modal.cancel.text')}
                  </Button>

                  <Button
                    type="submit"
                    className={styles.submitButton}
                    disabled={shouldLockActions}
                  >
                    {t('common.modal.save.textWithSubject', {
                      subject: t(
                        'registration.form.guardian.email.input.label'
                      ),
                    })}
                  </Button>
                </div>
              </>
            )}
          </Form>
        );
      }}
    </Formik>
  );
}
