/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Select as HDSSelect, SelectProps as HDSSelectProps } from 'hds-react';
import { useField } from 'formik';
import { useTranslation } from 'react-i18next';

import { Option } from './types';
import styles from './formikInputs.module.scss';

type SelectProps = Omit<
  HDSSelectProps,
  'onChange' | 'value' | 'defaultValue' | 'texts'
> & {
  onChange?: (values: string[]) => void;
  value?: string[];
  options: Option[];
  label?: string;
  placeholder?: string;
  helperText?: string;
  catchEscapeKey?: boolean;
};

export type ComboboxProps = SelectProps & {
  name: string;
};

function Combobox({
  name,
  onChange,
  options,
  value: userValue,
  label,
  placeholder,
  helperText,
  ...rest
}: ComboboxProps) {
  const { t } = useTranslation();
  const [{ value = [], ...field }, meta, helpers] = useField<string[]>(name);

  const handleChange = (selectedItems: (Option | string)[]) => {
    // HDS 4.x Select returns string values, not Option objects
    const nextValues = selectedItems
      .map((item) => (typeof item === 'string' ? item : item.value))
      .filter((value): value is string => Boolean(value));

    if (onChange) {
      onChange(nextValues);
    } else {
      helpers.setValue(nextValues);
    }
  };

  const handleBlur = () => {
    helpers.setTouched(true);
  };

  const usedValue = userValue || value;

  return (
    <HDSSelect
      {...field}
      className={styles.formField}
      invalid={meta.touched && Boolean(meta.error)}
      onBlur={handleBlur}
      onChange={handleChange}
      value={usedValue}
      multiSelect
      texts={{
        label: label || '',
        placeholder: placeholder || '',
        ...(helperText ? { helperText } : {}),
        ...(meta.touched && meta.error ? { error: t(meta.error || '') } : {}),
        language: 'fi',
      }}
      {...rest}
    >
      {(options as Option[]).map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </HDSSelect>
  );
}

export default Combobox;
