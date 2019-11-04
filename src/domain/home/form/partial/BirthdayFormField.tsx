import React, { FunctionComponent } from 'react';
import { Field, FieldArrayRenderProps } from 'formik';

import InputField from '../../../../common/components/form/fields/input/InputField';
import { formatMessage } from '../../../../common/translation/utils';
import styles from './birthdayFormField.module.scss';
import { validateRequire } from '../../../../common/components/form/validationUtils';

const BirthdayFormField: FunctionComponent<FieldArrayRenderProps> = ({
  form: { errors },
}) => {
  const error = errors['childBirthDay'];

  return (
    <div className={styles.birthdayField}>
      <label>
        {formatMessage('homePage.preliminaryForm.childBirthday.input.label')}
      </label>
      <div className={styles.inputWrapper}>
        <Field
          type="number"
          name="child.birthday.day"
          component={InputField}
          placeholder={formatMessage(
            'homePage.preliminaryForm.childBirthday.input.day.placeholder'
          )}
          validate={(value: number) => validateRequire(value)}
          min={1}
          max={31}
        />
        <div className={styles.dot}>.</div>
        <Field
          type="number"
          name="child.birthday.month"
          component={InputField}
          validate={(value: number) => validateRequire(value)}
          placeholder={formatMessage(
            'homePage.preliminaryForm.childBirthday.input.month.placeholder'
          )}
          min={1}
          max={12}
        />
        <div className={styles.dot}>.</div>
        <Field
          type="number"
          name="child.birthday.year"
          component={InputField}
          validate={(value: number) => validateRequire(value)}
          placeholder={formatMessage(
            'homePage.preliminaryForm.childBirthday.input.year.placeholder'
          )}
          min={2019}
        />
      </div>
      <div className={styles.error}>{error}</div>
    </div>
  );
};

export default BirthdayFormField;
