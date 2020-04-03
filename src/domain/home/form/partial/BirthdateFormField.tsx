import React, { FunctionComponent } from 'react';
import { FieldArrayRenderProps, getIn } from 'formik';
import { useTranslation } from 'react-i18next';

import styles from './birthdateFormField.module.scss';
import { validateRequire } from '../../../../common/components/form/validationUtils';
import EnhancedInputField from '../../../../common/components/form/fields/input/EnhancedInputField';
import NumberInputField from '../../../../common/components/form/fields/input/NumberInputField';
import {
  formatTime,
  newMoment,
  toZeroBasedMonth,
} from '../../../../common/time/utils';
import { DEFAULT_DATE_FORMAT } from '../../../../common/time/TimeConstants';
import { Birthdate } from '../../../child/form/ChildForm';

interface BirthdateFormFieldProps extends FieldArrayRenderProps {
  isImmutable?: boolean;
  values?: Birthdate;
}

const BirthdateFormField: FunctionComponent<BirthdateFormFieldProps> = ({
  name,
  isImmutable = false,
  values,
  form: { errors, touched },
}) => {
  const fieldTouched =
    getIn(touched, 'child.birthdate.day') || getIn(touched, 'birthdate.day');
  const error = getIn(errors, 'childBirthdate');
  const { t } = useTranslation();

  if (isImmutable && values) {
    const monthZeroBased = toZeroBasedMonth(values.month);
    const birthdate = formatTime(
      newMoment([values.year, monthZeroBased, values.day]),
      DEFAULT_DATE_FORMAT
    );

    return (
      <div className={styles.birthdateField}>
        <label>{`${t(
          'homePage.preliminaryForm.childBirthdate.input.label'
        )}*`}</label>
        <p className={styles.immutableField}>{birthdate}</p>
      </div>
    );
  }

  return (
    <div className={styles.birthdateField}>
      <label>{`${t(
        'homePage.preliminaryForm.childBirthdate.input.label'
      )}*`}</label>
      <div className={styles.inputWrapper}>
        <EnhancedInputField
          name={`${name}.day`}
          component={NumberInputField}
          aria-label={t(
            'homePage.preliminaryForm.childBirthdate.input.day.placeholder'
          )}
          placeholder={t(
            'homePage.preliminaryForm.childBirthdate.input.day.placeholder'
          )}
          required={true}
          min={1}
          max={31}
          maxLength={2}
        />
        <div className={styles.dot}>.</div>
        <EnhancedInputField
          name={`${name}.month`}
          required={true}
          component={NumberInputField}
          aria-label={t(
            'homePage.preliminaryForm.childBirthdate.input.month.placeholder'
          )}
          placeholder={t(
            'homePage.preliminaryForm.childBirthdate.input.month.placeholder'
          )}
          min={1}
          max={12}
          maxLength={2}
        />
        <div className={styles.dot}>.</div>
        <EnhancedInputField
          required={true}
          name={`${name}.year`}
          maxLength={4}
          component={NumberInputField}
          validate={(value: number) => validateRequire(value)}
          aria-label={t(
            'homePage.preliminaryForm.childBirthdate.input.year.placeholder'
          )}
          placeholder={t(
            'homePage.preliminaryForm.childBirthdate.input.year.placeholder'
          )}
        />
      </div>
      {/* not to display error at first render until input got touched */}
      {fieldTouched && <div className={styles.error}>{t(error)}</div>}
    </div>
  );
};

export default BirthdateFormField;
