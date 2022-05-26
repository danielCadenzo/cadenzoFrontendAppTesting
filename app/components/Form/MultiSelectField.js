'use es6';

import React, { useCallback } from 'react';
import { useField } from 'react-form';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Select from 'react-select';

const Wrapper = styled.div`
  padding: 8px;
  background-color: white;
  color: black;
  border: 1px solid rgba(0, 0, 0, 0.23);
  border-radius: 4px;
  border-color: rgba(0, 0, 0, 0.23);
`;

const StyledSelect = styled(Select)`
  padding: 8px;
  border: none;
`;
export default function SelectField(props) {
  const { name = 'input', options, onUpdate, ...rest } = props;
  const {
    meta: { error, isTouched, isValidating },
    value,
    setValue,
  } = useField(name);

  const handleChange = useCallback(selectedOptions => {
    setValue(selectedOptions.map(opt => opt.value));
    if (onUpdate) onUpdate(selectedOptions);
  }, []);

  const valuesFromOptions = options.filter(opt => {
    if (Array.isArray(value)) {
      return value.find(v => opt.value === v);
    }
    return opt.value === value;
  });

  return (
    <Wrapper>
      <StyledSelect
        options={options}
        onChange={handleChange}
        defaultValue={value}
        value={valuesFromOptions}
        {...rest}
      />
    </Wrapper>
  );
}

SelectField.propTypes = {
  name: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.object),
};
