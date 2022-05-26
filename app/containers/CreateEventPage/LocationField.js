import React, { useCallback } from 'react';
import LocationSelect from 'components/AsyncSelect/LocationSelect';
import { useField } from 'react-form';

export default function LocationField(props) {
  const { setValue, value, getInputProps } = useField('address');

  const handleChange = useCallback(evt => {
    setValue(evt);
  }, []);

  return (
    <LocationSelect
      {...props}
      onChange={handleChange}
      placeholder="Enter Location"
      value={value}
    />
  );
}
