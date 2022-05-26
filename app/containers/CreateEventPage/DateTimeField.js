import React, { useCallback } from 'react';
import { useField } from 'react-form';
import { DateTime } from 'luxon';
import DatePicker from 'react-datepicker';
import PropTypes from 'prop-types';

export default function DateTimeField(props) {
  const { name = 'date', selected = DateTime.now(), ...rest } = props;
  const {
    meta: { error, isTouched, isValidating },
    value,
    setValue,
  } = useField(name, {
    defaultValue: selected,
  });

  const handleChange = useCallback(date => {
    setValue(DateTime.fromJSDate(new Date(date)));
  }, []);

  return (
    <DatePicker
      {...rest}
      value={value.toJSDate()}
      selected={value.toJSDate()}
      onChange={handleChange}
    />
  );
}

DateTimeField.propTypes = {
  name: PropTypes.string,
};
