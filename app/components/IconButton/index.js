/**
 *
 * IconButton
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  border-radius: 25%;
  cursor: pointer;
`;

function IconButton(props) {
  return (
    <Wrapper {...props}>
      <img
        alt={props.alt}
        src={props.icon}
        width={props.iconWidth}
        height={props.iconHeight || props.iconWidth}
      />
    </Wrapper>
  );
}

IconButton.propTypes = {
  alt: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired,
  iconWidth: PropTypes.number,
  iconHeight: PropTypes.number,
};

IconButton.defaultProps = {
  iconWidth: 20,
};

export default memo(IconButton);
