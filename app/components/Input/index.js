/**
 *
 * Input
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.input`
  background: #fafbfc;
  border: 0.5px solid #586069;
  box-sizing: border-box;
  border-radius: 4px;
  padding: 4px;
`;

function Input(props) {
  return <Wrapper {...props} />;
}

Input.propTypes = {};

export default memo(Input);
