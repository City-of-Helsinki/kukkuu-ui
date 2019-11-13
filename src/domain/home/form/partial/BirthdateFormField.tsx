import React, { FunctionComponent } from 'react';
import { Field, FieldArrayRenderProps } from 'formik';
import { useTranslation } from 'react-i18next';

import InputField from '../../../../common/components/form/fields/input/InputField';
import styles from './birthdateFormField.module.scss';
import { validateRequire } from '../../../../common/components/form/validationUtils';

const BirthdateFormField: FunctionComponent<FieldArrayRenderProps> = ({
  form: { errors },
}) => {
  const error = errors['childBIRTHDATE'];
  const { t } = useTranslation();

  return (
    <div className={styles.birthdateField}>
      <label>{t('homePage.preliminaryForm.childBirthdate.input.label')}</label>
      <div className={styles.inputWrapper}>
        <Field
          type="number"
          name="child.birthdate.day"
          component={InputField}
          placeholder={t(
            'homePage.preliminaryForm.childBirthdate.input.day.placeholder'
          )}
          validate={(value: number) => validateRequire(value)}
          min={1}
          max={31}
        />
        <div className={styles.dot}>.</div>
        <Field
          type="number"
          name="child.birthdate.month"
          component={InputField}
          validate={(value: number) => validateRequire(value)}
          placeholder={t(
            'homePage.preliminaryForm.childBirthdate.input.month.placeholder'
          )}
          min={1}
          max={12}
        />
        <div className={styles.dot}>.</div>
        <Field
          type="number"
          name="child.birthdate.year"
          component={InputField}
          validate={(value: number) => validateRequire(value)}
          placeholder={t(
            'homePage.preliminaryForm.childBirthdate.input.year.placeholder'
          )}
          min={2019}
        />
      </div>
      <div className={styles.error}>{error}</div>
    </div>
  );
};

export default BirthdateFormField;
