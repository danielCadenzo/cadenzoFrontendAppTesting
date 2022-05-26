import React, { useCallback } from 'react';
import LocationSelect from 'components/AsyncSelect/LocationSelect';
import { useField } from 'react-form';

export default function LocationField(props) {
  const { name = 'address', useRawAddress } = props;
  const { setValue, value, getInputProps } = useField(name);

  const handleChange = useCallback((formattedAddress, newValue) => {
    if (useRawAddress) {
      setValue(formattedAddress);
    } else {
      setValue(newValue);
    }
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
