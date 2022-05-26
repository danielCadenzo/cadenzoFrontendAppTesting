'use es6';

import React, { useCallback, useMemo } from 'react';
import { useField } from 'react-form';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  padding: 8px;
  background-color: white;
  display: flex;
  align-items: center;
  color: black;
  border: 1px solid rgba(0, 0, 0, 0.23);
  border-radius: 4px;
  border-color: rgba(0, 0, 0, 0.23);
`;

const Select = styled.select`
  padding: 8px;
  border: none;
`;
export default function SelectField(props) {
  const {
    name = 'input',
    options,
    disabled,
    className,
    label,
    ...rest
  } = props;
  const {
    meta: { error, isTouched, isValidating },
    value,
    setValue,
  } = useField(name);

  const handleChange = useCallback(evt => {
    setValue(evt.target.value);
  }, []);

  const selectOptions = useMemo(
    () =>
      options.map(option => (
        <option disabled={disabled} value={option.value}>
          {option.label}
        </option>
      )),
    [options],
  );

  return (
    <Wrapper className={className}>
      {label}
      <Select disabled={disabled} value={value} onChange={handleChange}>
        {selectOptions}
      </Select>
    </Wrapper>
  );
}

SelectField.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.any,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any,
      label: PropTypes.any,
    }),
  ),
  disabled: PropTypes.bool,
};
