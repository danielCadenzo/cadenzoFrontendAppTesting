/**
 *
 * UiImageCarousel
 *
 */

import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  background-size: cover;
  background-position: center;
  align-items: center;
  background-repeat: no-repeat !important;
  justify-content: space-between;
  background-image: url(${({ url }) => url});
`;

const DirectionalButton = styled(IconButton)`
  background-color: white !important;
  height: 32px;
  width: 32px;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  &:disabled {
    visibility: invisible;
  }

  @media (max-width: 400px) {
    height: 16px !important;
    width: 16px !important;
  }
`;

function UiImageCarousel({ images, className }) {
  const [selectedImageIndex, setImageIndex] = useState(0);
  const hasPrevious = selectedImageIndex > 0;
  const hasNext = selectedImageIndex < images.length - 1;

  const onLeftClick = e => {
    if (hasPrevious) {
      setImageIndex(selectedImageIndex - 1);
    }
    e.stopPropagation();
    e.preventDefault();
    return null;
  };

  const onRightClick = e => {
    if (hasNext) {
      setImageIndex(selectedImageIndex + 1);
    }
    e.stopPropagation();
    e.preventDefault();
    return null;
  };

  return (
    <Wrapper className={className} url={images[selectedImageIndex]}>
      <DirectionalButton
        onClick={onLeftClick}
        disabled={!hasPrevious}
        size="small"
        className="ml-1"
      >
        <b>&#60;</b>
      </DirectionalButton>

      <DirectionalButton
        onClick={onRightClick}
        disabled={!hasNext}
        size="small"
        className="mr-1"
      >
        <b>&#62;</b>
      </DirectionalButton>
    </Wrapper>
  );
}

UiImageCarousel.propTypes = {
  images: PropTypes.number,
};

export default memo(UiImageCarousel);
