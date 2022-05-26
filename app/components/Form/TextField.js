import React, { useCallback } from 'react';
import { useField } from 'react-form';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Input = styled.textarea`
  padding: 16px;
  background-color: white;
  color: black;
  border: none;
  border-radius: 4px;
  min-height: 150px;
  border-style: solid;
  border-width: 1px;
  border-color: rgba(0, 0, 0, 0.23);
`;

export default function InputField(props) {
  const { name = 'text', ...rest } = props;
  const { value, setValue } = useField(name);

  const handleChange = useCallback(evt => {
    setValue(evt.target.value);
  }, []);

  return <Input value={value} {...rest} onChange={handleChange} />;
}

InputField.propTypes = {
  name: PropTypes.string,
};
