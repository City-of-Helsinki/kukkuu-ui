import React from 'react';
import { useField } from 'formik';
import { useTranslation } from 'react-i18next';
import { TextInput, TextInputProps } from 'hds-react';

import styles from './formikInputs.module.scss';

type Props = {
  name: string;
  id: string;
  helperText?: string;
  label: string;
  required?: boolean;
} & TextInputProps;

function FormikTextInput({
  name,
  id,
  helperText,
  labelText,
  required,
  ...rest
}: Props) {
  const { t } = useTranslation();
  // eslint-disable-next-line react/destructuring-assignment
  const [field, meta] = useField(name);

  return (
    <TextInput
      {...field}
      id={id}
      className={styles.formField}
      invalid={meta.touched && Boolean(meta.error)}
      helperText={(Boolean(meta.touched) && t(meta.error || '')) || undefined}
      labelText={labelText}
      required={required}
      {...rest}
    />
  );
}

export default FormikTextInput;