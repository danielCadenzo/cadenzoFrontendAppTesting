/**
 *
 * Button
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { cadenzoPrimary } from 'utils/CssVariables';

const Wrapper = styled.button`
  color: ${props => (props.inverted ? cadenzoPrimary : 'white')};
  background: ${props => (props.inverted ? 'white' : cadenzoPrimary)};
  border-radius: 4px;
  padding: 8px;
  cursor: pointer;
  margin: 8px;
  width: fit-content;
  border: 1px solid ${props => (props.inverted ? cadenzoPrimary : 'none')};
`;

function Button(props) {
  const { onClick, inverted } = props;
  return (
    <Wrapper {...props} inverted={inverted}>
      {props.children}
    </Wrapper>
  );
}

Button.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
  onClick: PropTypes.func.isRequired,
  inverted: PropTypes.bool,
};

Button.defaultProps = {
  inverted: false,
};

export default memo(Button);
