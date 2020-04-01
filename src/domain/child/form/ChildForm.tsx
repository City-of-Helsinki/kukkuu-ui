import React, { FunctionComponent /*, useState */ } from 'react';
import { Formik, FieldArray, FormikErrors } from 'formik';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';

import styles from './childForm.module.scss';
import BirthdateFormField from '../../home/form/partial/BirthdateFormField';
import EnhancedInputField from '../../../common/components/form/fields/input/EnhancedInputField';
import InputField from '../../../common/components/form/fields/input/InputField';
import Button from '../../../common/components/button/Button';
import SelectField from '../../../common/components/form/fields/select/SelectField';
import { Child } from '../types/ChildTypes';
import { getTranslatedRelationshipOptions } from '../ChildUtils';
import {
  validatePostalCode,
  validateDate,
} from '../../../common/components/form/validationUtils';
import { formatTime, newMoment } from '../../../common/time/utils';
import { BACKEND_DATE_FORMAT } from '../../../common/time/TimeConstants';

export interface ChildFormValues extends Omit<Child, 'birthdate'> {
  birthdate: {
    day: number | string;
    month: number | string;
    year: number | string;
  };
  childBirthdate?: string;
}

interface ChildFormProps {
  initialValues: ChildFormValues;
  onSubmit: (payload: Child) => void;
  onDelete?: () => void;
  onCancel: () => void;
  setFormIsFilling: (value: boolean) => void;
  formType?: CHILD_FORM_TYPES;
}

const immutableFields = ['birthdate'];

export enum CHILD_FORM_TYPES {
  ADD = 'ADD',
  EDIT = 'EDIT',
}

const ChildForm: FunctionComponent<ChildFormProps> = ({
  initialValues,
  onSubmit,
  onDelete,
  onCancel,
  setFormIsFilling,
  formType = CHILD_FORM_TYPES.ADD,
}) => {
  const { t } = useTranslation();
  const isEditForm = formType === CHILD_FORM_TYPES.EDIT;

  // Child who already have relationship can not go back to have empty relationship anymore
  // Why ? Ask backend guys.
  const isChildHavingRelationship = !!initialValues.relationship?.type;

  const onFormSubmit = (values: ChildFormValues) => {
    setFormIsFilling(false);
    const child: Child = Object.assign({}, values, {
      birthdate: formatTime(
        newMoment(
          `${values.birthdate.year}-${values.birthdate.month}-${values.birthdate.day}`,
          BACKEND_DATE_FORMAT
        )
      ),
    });
    onSubmit(child);
  };

  const validateForm = (values: ChildFormValues) => {
    const {
      birthdate: { day, month, year },
    } = values;
    setFormIsFilling(true);

    const errors: FormikErrors<ChildFormValues> = {};

    if (day && month && year) {
      errors.childBirthdate = validateDate(`${day}.${month}.${year}`);

      if (!errors.childBirthdate) {
        // Delete the property manually so form will be valid when this is undefined.
        delete errors.childBirthdate;
      }
    }
    return errors;
  };

  const isFieldImmutable = (fieldName: string) => {
    return isEditForm && immutableFields.includes(fieldName);
  };

  return (
    <Formik
      validate={validateForm}
      initialValues={initialValues}
      onSubmit={onFormSubmit}
    >
      {({ isSubmitting, handleSubmit, values }) => (
        <form onSubmit={handleSubmit} id="childForm">
          <FieldArray
            name="birthdate"
            render={(props) => {
              const isImmutable = isFieldImmutable('birthdate');
              return (
                <BirthdateFormField
                  values={values['birthdate']}
                  isImmutable={isImmutable}
                  {...props}
                />
              );
            }}
          />

          <div className={styles.childInfo}>
            <EnhancedInputField
              className={styles.childHomeCity}
              id="homeCity"
              name="homeCity"
              label={t('homePage.preliminaryForm.childHomeCity.input.label')}
              required={true}
              component={InputField}
              placeholder={t(
                'homePage.preliminaryForm.childHomeCity.input.placeholder'
              )}
            />

            <EnhancedInputField
              className={styles.childPostalCode}
              required={true}
              id="postalCode"
              name="postalCode"
              validate={validatePostalCode}
              label={t('registration.form.child.postalCode.input.label')}
              component={InputField}
              placeholder={t(
                'registration.form.child.postalCode.input.placeholder'
              )}
            />
          </div>

          <div className={styles.childName}>
            <EnhancedInputField
              id="firstName"
              name="firstName"
              label={t('registration.form.child.firstName.input.label')}
              component={InputField}
              autoComplete="new-password"
              placeholder={t(
                'registration.form.child.firstName.input.placeholder'
              )}
            />
            <EnhancedInputField
              id="lastName"
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
            id="relationship.type"
            name="relationship.type"
            label={t('registration.form.child.relationship.input.label')}
            autoSelect={isChildHavingRelationship}
            component={SelectField}
            options={getTranslatedRelationshipOptions(t)}
            placeholder={t(
              'registration.form.child.relationship.input.placeholder'
            )}
          />

          <div
            className={classnames(
              styles.buttonGroup,
              isEditForm ? styles.editChildButtons : styles.addChildButtons
            )}
          >
            {isEditForm && (
              <Button className={styles.cancelButton} onClick={onCancel}>
                {t('common.modal.cancel.text')}
              </Button>
            )}
            <Button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {t(
                isEditForm
                  ? 'common.modal.save.text'
                  : 'child.form.modal.add.label'
              )}
            </Button>
          </div>

          {isEditForm && (
            <Button
              className={styles.deleteChild}
              ariaLabel={t('profile.child.detail.delete.text')}
              onClick={onDelete}
            >
              {t('profile.child.detail.delete.text')}
            </Button>
          )}
        </form>
      )}
    </Formik>
  );
};

export default ChildForm;
