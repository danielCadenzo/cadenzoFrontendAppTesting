/**
 *
 * Badge
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { cadenzoPrimary } from 'utils/CssVariables';

const Wrapper = styled.div`
  border: 2px #e1e4e8 solid !important;
  padding: 8px 12px;
  border-radius: 8px;
  height: fit-content;
  width: fit-content;
  flex-shrink: 0;
  ${({ color }) => `color: ${color || 'inherit'};`}
  ${({ backgroundColor }) =>
    `background-color: ${backgroundColor || 'inherit'};`}
`;
function Badge(props) {
  return <Wrapper {...props}>{props.children}</Wrapper>;
}

Badge.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
  backgroundColor: PropTypes.string,
  color: PropTypes.string,
};

Badge.defaultProps = {
  color: 'white',
  backgroundColor: cadenzoPrimary,
};

export default memo(Badge);
