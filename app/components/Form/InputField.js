import React, { useCallback } from 'react';
import { useField } from 'react-form';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Input = styled.input`
  padding: 16px;
  background-color: white;
  color: black;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.23);
  min-width: 150px;
`;

export default function InputField(props) {
  const { name = 'input', hookProps = {}, onUpdate, ...rest } = props;
  const {
    meta: { error, isTouched, isValidating },
    value,
    setValue,
  } = useField(name, hookProps);

  const handleChange = useCallback(evt => {
    const inputValue = evt.target.value;
    const { type } = props;
    if (type === 'number') {
      setValue(parseInt(inputValue));
    } else {
      setValue(inputValue);
    }
    if (onUpdate) onUpdate(evt.target.value);
  }, []);

  return <Input value={value} {...rest} onChange={handleChange} />;
}

InputField.propTypes = {
  name: PropTypes.string,
  hookProps: PropTypes.object,
};
