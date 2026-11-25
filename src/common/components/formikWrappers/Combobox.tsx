import { Select as HDSSelect, SupportedLanguage } from 'hds-react';
import type { ComponentProps } from 'react';
import { useField } from 'formik';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { Option } from './types';
import styles from './formikInputs.module.scss';

type SelectProps = Omit<
  ComponentProps<typeof HDSSelect>,
  'onChange' | 'value' | 'defaultValue' | 'texts' | 'children'
> & {
  onChange?: (values: string[]) => void;
  value?: string[];
  options: Option[];
  label?: string;
  placeholder?: string;
  helperText?: string;
  catchEscapeKey?: boolean;
  className?: string;
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
  className,
  ...rest
}: ComboboxProps) {
  const { t, i18n } = useTranslation();
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
      className={classNames(styles.formField, className)}
      invalid={meta.touched && Boolean(meta.error)}
      onBlur={handleBlur}
      onChange={handleChange}
      value={usedValue}
      multiSelect
      options={options}
      texts={{
        label: label || '',
        placeholder: placeholder || '',
        ...(helperText ? { helperText } : {}),
        ...(meta.touched && meta.error ? { error: t(meta.error || '') } : {}),
        language: i18n.language as SupportedLanguage,
      }}
      {...rest}
    />
  );
}

export default Combobox;
