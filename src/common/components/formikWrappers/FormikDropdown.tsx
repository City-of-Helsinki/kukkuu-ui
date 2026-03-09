import { Select, SelectProps as HDSDropdownProps } from 'hds-react';
import { useField } from 'formik';
import { useTranslation } from 'react-i18next';

import { Option } from './types';
import styles from './formikInputs.module.scss';

type DropdownProps = Omit<
  HDSDropdownProps<Option>,
  'value' | 'onChange' | 'options' | 'defaultValue' | 'texts' | 'className'
>;

type Props = DropdownProps & {
  name: string;
  label?: string;
  placeholder?: string;
  value?: string;
  options: Option[];
  className?: string;
};

const emptyValue = {
  label: '',
  value: '',
};

function FormikDropdown({
  name,
  value: userValue,
  options,
  label,
  placeholder,
  className,
  ...rest
}: Props) {
  const { t, i18n } = useTranslation();
  const [{ value, ...field }, meta, helpers] = useField(name);

  const handleChange = (selectedItems: (Option | string)[]) => {
    // For single select, get first item
    // HDS 4.x Select returns string values, not Option objects
    if (selectedItems && selectedItems.length > 0) {
      const item = selectedItems[0];
      helpers.setValue(typeof item === 'string' ? item : item.value);
    } else {
      helpers.setValue('');
    }
  };

  const handleBlur = () => {
    helpers.setTouched(true);
  };

  const usedValue = userValue || value;
  const valueAsOption = options.find((option) => option.value === usedValue);

  return (
    <Select
      {...field}
      className={className || styles.formField}
      value={valueAsOption ? [valueAsOption] : [emptyValue]}
      options={options}
      onChange={handleChange}
      invalid={meta.touched && Boolean(meta.error)}
      onBlur={handleBlur}
      texts={{
        label: label || '',
        placeholder: placeholder || '',
        ...(meta.touched && meta.error ? { error: t(meta.error || '') } : {}),
        language: i18n.language,
      }}
      {...rest}
    />
  );
}

export default FormikDropdown;
