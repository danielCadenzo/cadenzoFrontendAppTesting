import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useField } from 'react-form';
import { Checkbox as MuiCheckbox, FormControlLabel } from '@material-ui/core';

const findValueInArray = (array = [], value) => {
  if (typeof value === 'object' && value.constructor === Object && value.id) {
    return array.findIndex(i => i.id === value.id);
  }
  return array.indexOf(value);
};

const Checkbox = ({
  field,
  label,
  isArray,
  value,
  style,
  forceAllUnchecked,
}) => {
  if (isArray && !value)
    throw new Error('Checkboxes that are used as for array must have a value.');
  const methods = useField(field);
  let currentValue = methods.value;
  if (currentValue === undefined) {
    if (isArray) {
      currentValue = [];
    } else {
      currentValue = false;
    }
    methods.setValue(currentValue);
  }

  const onChange = e => {
    if (e.target.checked) {
      if (isArray) {
        methods.pushValue(value);
      } else {
        methods.setValue(value || e.target.checked);
      }
    } else if (isArray) {
      const idx = findValueInArray(methods.value, value);
      if (idx > -1) methods.removeValue(idx);
    } else {
      methods.setValue(value ? undefined : false);
    }
  };

  const isChecked = useMemo(() => {
    if (forceAllUnchecked) return false;

    if (isArray) return findValueInArray(methods.value, value) > -1;

    return currentValue;
  }, [
    methods.value,
    value,
    currentValue,
    findValueInArray,
    isArray,
    forceAllUnchecked,
  ]);

  return (
    <FormControlLabel
      style={style}
      control={
        <MuiCheckbox
          {...methods.getInputProps()}
          checked={
            isArray ? findValueInArray(methods.value, value) > -1 : currentValue
          }
          onChange={onChange}
          value={value}
        />
      }
      label={label}
    />
  );
};

Checkbox.propTypes = {
  forceAllUnchecked: PropTypes.bool,
  label: PropTypes.string.isRequired,
  field: PropTypes.string.isRequired,
  isArray: PropTypes.bool,
  style: PropTypes.object,
  value: PropTypes.any,
};

Checkbox.defaultProps = {
  style: {},
  forceAllUnchecked: false,
};

export default Checkbox;
