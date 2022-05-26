/* eslint-disable no-nested-ternary */
/**
 *
 * ProgressBar
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Background = styled.div`
  width: ${props => (props.width ? props.width : '100%')};
  height: 16px;
  border-radius: 8px;
`;

const Segment = styled.div`
  width: ${props => props.percentage};
  height: 16px;
  border-radius: ${props =>
    !props.isLeft && !props.isRight
      ? '0px'
      : props.isRight
      ? '0px 8px 8px 0px'
      : '8px 0px 0px 8px'};
`;

function ProgressBar(props) {
  const sum = props.items.reduce((ac, curVal) => ac + curVal);
  const segments = props.items.map((segmt, i, arr) => {
    const isLeft = i === 0;
    const isRight = arr.length === i;

    return (
      <Segment
        isLeft={isLeft}
        isRight={isRight}
        percentage={`${(segmt / sum) * 100}%`}
      />
    );
  });

  return <Background>{...segments}</Background>;
}

ProgressBar.propTypes = {
  items: PropTypes.arrayOf([PropTypes.numbers]).isRequired,
};

export default memo(ProgressBar);
