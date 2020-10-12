import React from 'react';
import { Select, SelectProps as HDSDropdownProps } from 'hds-react';
import { useField } from 'formik';
import { useTranslation } from 'react-i18next';

import { Option } from './types';
import styles from './formikInputs.module.scss';

type DropdownProps = Omit<
  HDSDropdownProps<Option>,
  'value' | 'onChange' | 'options' | 'defaultValue'
>;

type Props = DropdownProps & {
  name: string;
  onChange?: (selected: Option) => void;
  value?: string;
  options: Option[];
};

const emptyValue = {
  label: '',
  value: '',
};

function FormikDropdown({
  name,
  onChange = () => ({}),
  value: userValue,
  options,
  ...rest
}: Props) {
  const { t } = useTranslation();
  const [{ value, ...field }, meta, helpers] = useField(name);

  const handleChange = (selectedItem: Option | Option[]) => {
    if (Array.isArray(selectedItem)) {
      helpers.setValue(selectedItem.map((item) => item.value));
    } else {
      helpers.setValue(selectedItem.value);
    }
  };

  const handleBlur = () => {
    helpers.setTouched(true);
  };

  const usedValue = userValue || value;
  const valueAsOption = options.find((option) => option.value === usedValue);

  return (
    <Select<Option>
      {...field}
      className={styles.formField}
      value={valueAsOption || emptyValue}
      options={options}
      onChange={handleChange}
      invalid={meta.touched && Boolean(meta.error)}
      error={meta.touched && Boolean(meta.error) && t(meta.error || '')}
      onBlur={handleBlur}
      {...rest}
      multiselect={false}
    />
  );
}

export default FormikDropdown;
