import * as React from 'react';
import { Checkbox, CheckboxProps } from 'hds-react';
import { useField } from 'formik';
import { useTranslation } from 'react-i18next';

import styles from './checkboxField.module.scss';

type Props = {
  name: string;
} & CheckboxProps;

function CheckboxField({ name, onChange, ...rest }: Props) {
  const { t } = useTranslation();
  const [field, meta] = useField({ name });

  // NOTE: It seems like the onChange handlers of the useInput
  // and the custom implementation needs to be combined
  // with a new yet another handler.
  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e);
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div>
      <Checkbox
        {...rest}
        {...field}
        className={styles.checkboxField}
        type="checkbox"
        checked={Boolean(field.value)}
        onChange={onChangeHandler}
      />
      {meta.error && meta.touched && (
        <p className={styles.errorText}>{t(meta.error)}</p>
      )}
    </div>
  );
}

export default CheckboxField;
