import * as React from 'react';
import { Checkbox, CheckboxProps } from 'hds-react';
import { useField } from 'formik';
import { useTranslation } from 'react-i18next';

import styles from './checkboxField.module.scss';

const kukkuuCheckboxStyles = {
  '--background-hover': 'var(--color-summer-dark)',
  '--background-selected': 'var(--color-summer)',
  '--background-color-selected-hover': 'var(--color-summer-dark)',
  '--background-color-selected-focus': 'var(--color-summer-dark)',
  '--background-color-selected-hover-focus': 'var(--color-summer-dark)',
  '--border-color-selected': 'var(--color-summer)',
  '--border-color-selected-hover': 'var(--color-summer-dark)',
  '--border-color-selected-focus': 'var(--color-summer-dark)',
  '--border-color-selected-hover-focus': 'var(--color-summer-dark)',
  '--icon-color-selected': 'var(--color-black)',
} as React.CSSProperties;

type Props = {
  name: string;
} & CheckboxProps;

function CheckboxField(props: Props) {
  const { name, onChange } = props;
  const { t } = useTranslation();
  const [field, meta] = useField({ name });

  // NOTE: It seems like the onChange handlers of the useInput
  // and the custom implementation needs to be combined
  // with a new yet another handler.
  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e);
    onChange && onChange(e);
  };

  return (
    <div>
      <Checkbox
        {...props}
        {...field}
        type="checkbox"
        style={kukkuuCheckboxStyles}
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
