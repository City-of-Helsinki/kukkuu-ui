import React, { Component } from 'react';
import { FieldProps } from 'formik';

import Select, { SelectProps } from '../../../select/Select';

class SelectField extends Component<SelectProps & FieldProps> {
  render() {
    const { form, ...rest } = this.props;

    return <Select {...rest} />;
  }
}

export default SelectField;
