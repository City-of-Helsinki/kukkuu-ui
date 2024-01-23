import { FunctionComponent } from 'react';
import { Formik, FormikProps, Form } from 'formik';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';
import * as yup from 'yup';

import styles from './childForm.module.scss';
import FormikDropdown from '../../../common/components/formikWrappers/FormikDropdown';
import { Child } from '../types/ChildInputTypes';
import { getTranslatedRelationshipOptions } from '../ChildUtils';
import Button from '../../../common/components/button/Button';
import FormikTextInput from '../../../common/components/formikWrappers/FormikTextInput';
import { SUPPORTED_START_BIRTH_YEAR } from '../../../common/time/TimeConstants';

const schema = yup.object().shape({
  homeCity: yup.string().required('validation.general.required'),
  postalCode: yup
    .string()
    .length(5, 'registration.form.child.postalCode.input.error.length')
    .required('validation.general.required'),
  name: yup
    .string()
    .required('validation.general.required')
    .max(255, 'validation.maxLength'),
  birthyear: yup
    .number()
    .required('validation.general.required')
    .min(SUPPORTED_START_BIRTH_YEAR, 'validation.date.unSupported')
    .max(new Date().getFullYear(), 'validation.date.unSupported'),
  relationship: yup.object().shape({
    type: yup.string().required('validation.general.required'),
  }),
});

interface ChildFormProps {
  initialValues: Child;
  onSubmit: (payload: Child) => void;
  onDelete?: () => void;
  onCancel: () => void;
  setFormIsFilling: (value: boolean) => void;
  formType?: CHILD_FORM_TYPES;
}

const immutableFields = ['birthyear'];

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

  const onFormSubmit = (values: Child) => {
    setFormIsFilling(false);
    onSubmit(values);
  };

  const isFieldImmutable = (fieldName: string) => {
    return isEditForm && immutableFields.includes(fieldName);
  };

  const relationshipOptions = getTranslatedRelationshipOptions(t);
  const isImmutable = isFieldImmutable('birthyear');

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={onFormSubmit}
    >
      {({ isSubmitting, values }: FormikProps<Child>) => (
        <Form id="childForm" noValidate>
          {isImmutable ? (
            <div className={styles.birthyearField}>
              <label>{`${t(
                'homePage.preliminaryForm.childBirthyear.input.label'
              )}*`}</label>
              <p className={styles.immutableField}>{values.birthyear}</p>
            </div>
          ) : (
            <FormikTextInput
              type="number"
              name="birthyear"
              id="birthyear"
              label={t(
                'homePage.preliminaryForm.childBirthyear.input.year.placeholder'
              )}
              required={true}
              placeholder={t(
                'homePage.preliminaryForm.childBirthyear.input.year.placeholder'
              )}
            />
          )}

          <div className={styles.childInfo}>
            {!isEditForm && (
              <FormikTextInput
                id="homeCity"
                name="homeCity"
                label={t('homePage.preliminaryForm.childHomeCity.input.label')}
                required={true}
                placeholder={t(
                  'homePage.preliminaryForm.childHomeCity.input.placeholder'
                )}
              />
            )}
            <FormikTextInput
              className={styles.formField}
              id="postalCode"
              name="postalCode"
              required={true}
              label={t('registration.form.child.postalCode.input.label')}
              placeholder={t(
                'registration.form.child.postalCode.input.placeholder'
              )}
            />
          </div>
          <div className={styles.childName}>
            <FormikTextInput
              className={styles.formField}
              id="name"
              name="name"
              required={true}
              label={t('registration.form.child.name.input.label')}
              autoComplete="new-password"
              placeholder={t('registration.form.child.name.input.placeholder')}
            />
          </div>
          <FormikDropdown
            className={styles.formField}
            id="relationship.type"
            name="relationship.type"
            value={values.relationship?.type || ''}
            label={t('registration.form.child.relationship.input.label')}
            required={true}
            options={relationshipOptions}
            placeholder={t('common.select.default.text')}
          />
          <div
            className={classnames(
              styles.buttonGroup,
              isEditForm ? styles.editChildButtons : styles.addChildButtons
            )}
          >
            {isEditForm && (
              <Button
                variant="secondary"
                className={styles.cancelButton}
                onClick={onCancel}
              >
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
              variant="supplementary"
              className={styles.deleteChildButton}
              onClick={onDelete}
            >
              <span className={styles.deleteChildButtonText}>
                {t('profile.child.detail.delete.text')}
              </span>
            </Button>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default ChildForm;
