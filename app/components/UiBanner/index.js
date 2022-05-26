/**
 *
 * UiBanner
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  background-color: #e0cc67;
  padding: 12px;
  border-radius: 4px;
`;

function UiBanner({ title, text }) {
  return (
    <Wrapper className="full-width">
      <h4 className="h4"> {title} </h4>
      <p> {text} </p>
    </Wrapper>
  );
}

UiBanner.propTypes = {
  title: PropTypes.oneOf([PropTypes.string, PropTypes.node]),
  text: PropTypes.oneOf([PropTypes.string, PropTypes.node]),
};

export default memo(UiBanner);
