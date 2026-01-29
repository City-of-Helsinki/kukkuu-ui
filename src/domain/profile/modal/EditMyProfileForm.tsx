import * as React from 'react';
import { Formik, FormikProps, FormikErrors, Form } from 'formik';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/browser';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import * as yup from 'yup';

import styles from './editProfileModal.module.scss';
import { SUPPORT_LANGUAGES } from '../../../common/translation/TranslationConstants';
import profileQuery from '../queries/ProfileQuery';
import updateMyProfileMutation from '../mutations/updateMyProfileMutation';
import {
  type UpdateMyProfileMutation,
  type UpdateMyProfileMutationInput,
} from '../../api/generatedTypes/graphql';
import FormikDropdown from '../../../common/components/formikWrappers/FormikDropdown';
import Button from '../../../common/components/button/Button';
import FormikTextInput from '../../../common/components/formikWrappers/FormikTextInput';
import LanguagesCombobox from '../../languages/LanguagesCombobox';
import { EditProfileModalProps } from './EditProfileModal';
import {
  LanguagesSpokenAtHomeNode,
  MyProfile,
} from '../types/ProfileQueryTypes';
import RelayList from '../../api/relayList';
import CheckboxField from '../../../common/components/form/fields/checkbox/CheckboxField';
import { useProfileContext } from '../hooks/useProfileContext';
import graphqlClient from '../../api/client';

const schema = yup.object().shape({
  firstName: yup
    .string()
    .required('validation.general.required')
    .max(255, 'validation.maxLength'),
  lastName: yup
    .string()
    .required('validation.general.required')
    .max(255, 'validation.maxLength'),
  phoneNumber: yup
    .string()
    .required('validation.general.required')
    .max(255, 'validation.maxLength'),
  language: yup
    .string()
    .required('validation.general.required')
    .max(255, 'validation.maxLength'),
});

const LanguagesSpokenAtHome = RelayList<LanguagesSpokenAtHomeNode>();

function getInitialValues({
  languagesSpokenAtHome,
  ...rest
}: MyProfile): UpdateMyProfileMutationInput {
  return {
    ...rest,
    languagesSpokenAtHome: LanguagesSpokenAtHome(
      languagesSpokenAtHome
    ).items.map((language) => language.id),
  };
}

export default function EditMyProfileForm({
  initialValues,
  setIsOpen,
}: Pick<EditProfileModalProps, 'initialValues' | 'setIsOpen'>) {
  const { t } = useTranslation();
  const { trackEvent } = useMatomo();
  const [isFilling, setFormIsFilling] = React.useState(false);
  const { updateProfile } = useProfileContext();
  const [updateMyProfile] = useMutation<UpdateMyProfileMutation>(
    updateMyProfileMutation,
    {
      client: graphqlClient,
      refetchQueries: [{ query: profileQuery }],
    }
  );

  const onSubmit = async (payload: UpdateMyProfileMutationInput) => {
    setFormIsFilling(false);
    try {
      const input = {
        firstName: payload.firstName ?? initialValues.firstName,
        lastName: payload.lastName ?? initialValues.lastName,
        phoneNumber: payload.phoneNumber ?? initialValues.phoneNumber,
        language: payload.language ?? initialValues.language,
        hasAcceptedCommunication:
          payload.hasAcceptedCommunication ??
          initialValues.hasAcceptedCommunication,
        languagesSpokenAtHome: payload.languagesSpokenAtHome,
      };

      await updateMyProfile({
        variables: {
          input,
        },
      });

      updateProfile((prevValue) => ({
        ...(prevValue ?? initialValues),
        ...input,
        languagesSpokenAtHome: {
          __typename: 'LanguageNodeConnection',
          edges:
            input.languagesSpokenAtHome?.map((id) => ({ node: { id } })) ?? [],
        },
      }));

      toast.success(t('registration.submitMutation.successfulMessage'));
      trackEvent({ category: 'action', action: 'Edit profile' });
      setIsOpen(false);
    } catch (error) {
      toast.error(t('registration.submitMutation.errorMessage'));
      Sentry.captureException(error);
    }
  };

  const validate = () => {
    if (!isFilling) {
      setFormIsFilling(true);
    }

    const errors: FormikErrors<UpdateMyProfileMutationInput> = {};
    return errors;
  };

  return (
    <Formik
      initialValues={getInitialValues(initialValues)}
      onSubmit={onSubmit}
      validate={validate}
      validationSchema={schema}
    >
      {({ isSubmitting }: FormikProps<UpdateMyProfileMutationInput>) => (
        <Form id="editProfileForm">
          <FormikTextInput
            className={styles.formField}
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            minLength={5}
            maxLength={255}
            required={true}
            label={t('registration.form.guardian.phoneNumber.input.label')}
            placeholder={t(
              'registration.form.guardian.phoneNumber.input.placeholder'
            )}
          />
          <div className={styles.profileName}>
            <FormikTextInput
              className={styles.formField}
              type="text"
              required={true}
              id="firstName"
              name="firstName"
              label={t('registration.form.guardian.firstName.input.label')}
              placeholder={t(
                'registration.form.guardian.firstName.input.placeholder'
              )}
            />
            <FormikTextInput
              className={styles.formField}
              type="text"
              required={true}
              id="lastName"
              name="lastName"
              label={t('registration.form.guardian.lastName.input.label')}
              placeholder={t(
                'registration.form.guardian.lastName.input.placeholder'
              )}
            />
          </div>
          <FormikDropdown
            className={styles.formField}
            id="language"
            name="language"
            label={t('registration.form.guardian.language.input.label')}
            required={true}
            options={[
              {
                label: t('common.language.en'),
                value: SUPPORT_LANGUAGES.EN.toUpperCase(),
              },
              {
                label: t('common.language.fi'),
                value: SUPPORT_LANGUAGES.FI.toUpperCase(),
              },
              {
                label: t('common.language.sv'),
                value: SUPPORT_LANGUAGES.SV.toUpperCase(),
              },
            ]}
            placeholder={t(
              'registration.form.guardian.language.input.placeholder'
            )}
          />
          <LanguagesCombobox
            helperText={t(
              'registration.form.child.languagesSpokenAtHome.input.helper'
            )}
            id="languagesSpokenAtHome"
            label={t(
              'registration.form.child.languagesSpokenAtHome.input.label'
            )}
            name="languagesSpokenAtHome"
            // Block escape from closing the modal
            catchEscapeKey
          />
          <CheckboxField
            id={'hasAcceptedCommunication'}
            name={'hasAcceptedCommunication'}
            label={t(
              'registration.form.guardian.hasAcceptedCommunication.input.label'
            )}
          />
          <div className={styles.buttonsWrapper}>
            <Button
              onClick={() => {
                setIsOpen(false);
              }}
              variant="secondary"
              type="button"
              className={styles.cancelButton}
            >
              {t('common.modal.cancel.text')}
            </Button>

            <Button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {t('common.modal.save.text')}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
