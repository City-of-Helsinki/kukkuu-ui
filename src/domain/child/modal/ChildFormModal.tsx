import * as React from 'react';
import { Formik, FieldArray } from 'formik';
import { useTranslation } from 'react-i18next';

import Modal from '../../../common/components/modal/Modal';
import styles from './childFormModal.module.scss';
import BirthdateFormField from '../../home/form/partial/BirthdateFormField';
import EnhancedInputField from '../../../common/components/form/fields/input/EnhancedInputField';
import InputField from '../../../common/components/form/fields/input/InputField';
import Button from '../../../common/components/button/Button';
import SelectField from '../../../common/components/form/fields/select/SelectField';
import { Child } from '../types/ChildTypes';
import { getTranslatedRelationshipOptions } from '../childUtils';

export interface ChildFormModalValues extends Omit<Child, 'birthdate'> {
  birthdate: {
    day: number | string;
    month: number | string;
    year: number | string;
  };
}
interface ChildFormModalProps {
  initialValues: ChildFormModalValues;
  label: string;
  onSubmit: (values: ChildFormModalValues) => void;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const ChildFormModal: React.FunctionComponent<ChildFormModalProps> = ({
  initialValues,
  label,
  onSubmit,
  isOpen,
  setIsOpen,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.childFormModalWrapper}>
      <Modal isOpen={isOpen} label={label} toggleModal={setIsOpen}>
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          {({ isSubmitting, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <FieldArray
                name="birthdate"
                render={props => <BirthdateFormField {...props} />}
              />

              <div className={styles.childInfo}>
                <EnhancedInputField
                  className={styles.childHomeCity}
                  name="homeCity"
                  label={t(
                    'homePage.preliminaryForm.childHomeCity.input.label'
                  )}
                  required={true}
                  component={InputField}
                  placeholder={t(
                    'homePage.preliminaryForm.childHomeCity.input.placeholder'
                  )}
                />

                <EnhancedInputField
                  className={styles.childPostalCode}
                  name="postalCode"
                  label={t('registration.form.child.postalCode.input.label')}
                  component={InputField}
                  placeholder={t(
                    'registration.form.child.postalCode.input.placeholder'
                  )}
                />
              </div>

              <div className={styles.childName}>
                <EnhancedInputField
                  name="firstName"
                  label={t('registration.form.child.firstName.input.label')}
                  component={InputField}
                  autoComplete="new-password"
                  placeholder={t(
                    'registration.form.child.firstName.input.placeholder'
                  )}
                />
                <EnhancedInputField
                  name="lastName"
                  autoComplete="new-password"
                  label={t('registration.form.child.lastName.input.label')}
                  component={InputField}
                  placeholder={t(
                    'registration.form.child.lastName.input.placeholder'
                  )}
                />
              </div>

              <EnhancedInputField
                name="relationship"
                label={t('registration.form.child.relationship.input.label')}
                component={SelectField}
                id="registration.form.child.relationship.select"
                options={getTranslatedRelationshipOptions(t)}
                placeholder={t(
                  'registration.form.child.relationship.input.placeholder'
                )}
              />

              <Button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {t('child.form.modal.add.label')}
              </Button>
            </form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default ChildFormModal;
