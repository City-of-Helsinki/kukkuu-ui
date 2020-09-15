import React from 'react';
import { Checkbox, CheckboxProps } from 'hds-react';
import { useField } from 'formik';
import { useTranslation } from 'react-i18next';

import styles from './termsField.module.scss';

const kukkuuCheckboxStyles = {
  '--background-hover': 'var(--color-summer-dark-50)',
  '--background-selected': 'var(--color-summer)',
  '--background-color-selected-hover': 'var(--color-summer-dark-50)',
  '--background-color-selected-focus': 'var(--color-summer-dark-50)',
  '--background-color-selected-hover-focus': 'var(--color-summer-dark-50)',
  '--border-color-selected': 'var(--color-summer)',
  '--border-color-selected-hover': 'var(--color-summer-dark-50)',
  '--border-color-selected-focus': 'var(--color-summer-dark-50)',
  '--border-color-selected-hover-focus': 'var(--color-summer-dark-50)',
} as React.CSSProperties;

type Props = {
  name: string;
} & CheckboxProps;

function TermsField(props: Props) {
  const { name } = props;
  const { t } = useTranslation();
  const [field, meta] = useField(name);

  return (
    <div>
      <Checkbox
        {...props}
        {...field}
        type="checkbox"
        style={kukkuuCheckboxStyles}
        checked={Boolean(field.value)}
        label={<span className={styles.listLabel}>{props.label}</span>}
      />
      {meta.error && meta.touched && (
        <p className={styles.errorText}>{t(meta.error)}</p>
      )}
    </div>
  );
}

export default TermsField;
