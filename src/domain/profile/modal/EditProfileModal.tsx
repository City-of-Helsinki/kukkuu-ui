import * as React from 'react';
import { Formik, FieldArray, FormikErrors } from 'formik';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';

import styles from './editProfileModal.module.scss';
import { ProfileType } from '../type/ProfileTypes';
import { registrationFormDataSelector } from '../../registration/state/RegistrationSelectors';
import { defaultRegistrationData } from '../../registration/state/RegistrationReducers';
import { Guardian } from '../../guardian/types/GuardianTypes';
import Modal from '../../../common/components/modal/Modal';
import EnhancedInputField from '../../../common/components/form/fields/input/EnhancedInputField';
import InputField from '../../../common/components/form/fields/input/InputField';
import SelectField from '../../../common/components/form/fields/select/SelectField';
import { SUPPORT_LANGUAGES } from '../../../common/translation/TranslationConstants';
import Button from '../../../common/components/button/Button';

export type EditProfileModalValues = {
  firstName: string;
  lastName: string;
  email: string | null;
};

interface EditProfileModalProps {
  initialValues: ProfileType;
  onSubmit: (payload: Guardian) => void;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const EditProfileModal: React.FunctionComponent<EditProfileModalProps> = ({
  initialValues,
  onSubmit,
  isOpen,
  setIsOpen,
}) => {
  const [isFilling, setFormIsFilling] = React.useState(false);

  const { t } = useTranslation();
  //   const onSubmit = (payload: Guardian) => {
  //     saveProfile(payload);
  //     setIsOpen(false);
  //   };
  return (
    <div>
      <Modal
        setFormIsFilling={setFormIsFilling}
        label={t('registration.form.guardian.info.heading')}
        isOpen={isOpen}
        toggleModal={(value: boolean) => {
          setIsOpen(value);
        }}
      >
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          {({ isSubmitting, handleSubmit }) => (
            <form>
              <div className={styles.email}>
                <label>
                  {t('registration.form.guardian.email.input.label')}
                </label>
                <p className={styles.email}>{initialValues.email}</p>
              </div>
              <EnhancedInputField
                id="guardian.phoneNumber"
                name="guardian.phoneNumber"
                required={true}
                label={t('registration.form.guardian.phoneNumber.input.label')}
                component={InputField}
                placeholder={t(
                  'registration.form.guardian.phoneNumber.input.placeholder'
                )}
                value={initialValues.phoneNumber}
              />
              <div className={styles.profileName}>
                <EnhancedInputField
                  type="text"
                  required={true}
                  id="guardian.firstName"
                  name="guardian.firstName"
                  label={t('registration.form.guardian.firstName.input.label')}
                  component={InputField}
                  placeholder={t(
                    'registration.form.guardian.firstName.input.placeholder'
                  )}
                  value={initialValues.firstName}
                ></EnhancedInputField>
                <EnhancedInputField
                  type="text"
                  required={true}
                  id="guardian.lastName"
                  name="guardian.lastName"
                  label={t('registration.form.guardian.lastName.input.label')}
                  component={InputField}
                  placeholder={t(
                    'registration.form.guardian.lastName.input.placeholder'
                  )}
                  value={initialValues.lastName}
                />
              </div>
              <EnhancedInputField
                value={initialValues.language?.toLocaleLowerCase()}
                id="preferLanguage"
                name="preferLanguage"
                label={t('registration.form.guardian.language.input.label')}
                required={true}
                component={SelectField}
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
              <div className={styles.buttonsWrapper}>
                <Button
                  type="submit"
                  className={styles.cancelButton}
                  disabled={isSubmitting}
                >
                  {t('common.modal.cancel.text')}
                </Button>

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
      </Modal>
    </div>
  );
};

export default EditProfileModal;
