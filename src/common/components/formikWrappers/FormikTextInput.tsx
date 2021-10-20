import { useField, FieldValidator } from 'formik';
import { useTranslation } from 'react-i18next';
import { TextInput, TextInputProps } from 'hds-react';

import styles from './formikInputs.module.scss';

type Props = {
  name: string;
  id: string;
  helperText?: string;
  required?: boolean;
  validate?: FieldValidator;
} & TextInputProps;

function FormikTextInput({
  name,
  id,
  helperText,
  required,
  validate,
  ...rest
}: Props) {
  const { t } = useTranslation();
  // eslint-disable-next-line react/destructuring-assignment
  const [field, meta] = useField({ name, validate });

  return (
    // Since hds-react version 0.16.0, using <TextInput /> in a position
    // in the dom where it's a grid item, will lead to unexpectedly
    // positioned helper text. By wrapping the input in a <div> we stop
    // the <TextInput /> from becoming a grid item.
    <div>
      <TextInput
        {...field}
        id={id}
        className={styles.formField}
        invalid={meta.touched && Boolean(meta.error)}
        helperText={(Boolean(meta.touched) && t(meta.error || '')) || undefined}
        required={required}
        {...rest}
      />
    </div>
  );
}

export default FormikTextInput;
