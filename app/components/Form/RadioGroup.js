import React, { useCallback } from 'react';
import { useField } from 'react-form';
import PropTypes from 'prop-types';

export const Radio = ({
  value,
  label,
  groupValue,
  name,
  onChange,
  disabled,
}) => (
  <div className="d-flex flex-items-center">
    <input
      disabled={disabled}
      type="radio"
      onChange={onChange}
      checked={groupValue === value}
      id={value}
      value={value}
    />

    <label htmlFor={value}>
      <p className="f4 pl-2">{label}</p>
    </label>
  </div>
);

export default function RadioGroup(props) {
  const {
    name = 'input',
    defaultValue,
    hookProps = {},
    onUpdate,
    options,
    ...rest
  } = props;
  const {
    meta: { error, isTouched, isValidating },
    value,
    setValue,
  } = useField(name, hookProps);

  const handleChange = useCallback(evt => {
    const { value } = evt.target;
    const option = options.find(option => option.value === value);
    setValue(value);
    if (onUpdate) onUpdate(value, option);
  });

  return (
    <div>
      {options.map(option => (
        <Radio
          label={option.label}
          value={option.value}
          key={option.value}
          name={name}
          groupValue={value || defaultValue}
          onChange={handleChange}
        />
      ))}
    </div>
  );
}

RadioGroup.propTypes = {
  name: PropTypes.string,
  hookProps: PropTypes.object,
};
