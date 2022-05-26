/* eslint-disable prettier/prettier */
import React from 'react';
import styled from 'styled-components';
import emptyState from 'images/empty_states/image-placeholder.png';
import PropTypes from 'prop-types';

const ScrollContainer = styled.div`
  display: flex;
  height: 100%;
  overflow-x: auto;
  gap: 10px;
  background-color: #dddd;
  border-radius: 10px;
`;

const ScrollContainerItem = styled.img`
  height: 100%;
  margin-right: 2px;
  object-fit: cover;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
`;

function ScrollingGallery({ images }) {
  return (
    <ScrollContainer>
      {// 1st image is always main image
        Array(7)
          .fill(null)
          .map((imageSrc, index) => {
            if (images.length <= index)
              return <ScrollContainerItem src={emptyState} loading="lazy" />;
            return <ScrollContainerItem src={images[index]} loading="lazy" />;
          })}
    </ScrollContainer>
  );
}

ScrollingGallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
}

export default ScrollingGallery;
