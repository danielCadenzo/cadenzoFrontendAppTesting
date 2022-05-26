/* eslint-disable prettier/prettier */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import emptyState from 'images/empty_states/image-placeholder.png';

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-template-areas:
    'left side'
    'main side'
    'left side';
`;

const InnerContainer = styled.div`
  position: absolute;
  left: 0%;
  top: 0%;
  right: 0%;
  bottom: 0%;
  z-index: 1;
  display: block;
  background-color: rgba(246, 246, 250, 0.76);
  padding: 15px;
`;

const Img = styled.img`
  will-change: transform;
  transform: translate3d(0px, -8.9024px, 0px) scale3d(1, 1, 1) rotateX(0deg)
    rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg);
  transform-style: preserve-3d;

  position: absolute;
  left: auto;
  top: auto;
  right: -100px;
  bottom: -120px;
  width: 300px;
  height: 300px;
  border-radius: 20px;
  box-shadow: 1px 1px 10px 0 rgb(0 0 0 / 15%);
  -o-object-fit: cover;
  object-fit: cover;

  &.b-one {
    right: 540px;
    bottom: 60px;
  }

  &.b-two {
    right: 220px;
    bottom: -30px;
  }

  &.r-two {
    bottom: 200px;
  }

  &.r-one {
    bottom: 520px;
  }

  &.m-one {
    right: 220px;
    bottom: 290px;
  }

  &.bb-one {
    right: 540px;
    bottom: -260px;
  }
`;

const IMAGE_CLASSNAMES = [
  'b-two',
  'b-one',
  'm-one',
  'r-one',
  'r-two',
  'bb-one',
];

function HeroGrid({ images, children }) {
  return (
    <div>
      <Container className="hero-animation">
        <InnerContainer className="m-overlay">
          {// 1st image is always main image
            Array(7)
              .fill(null)
              .map((imageSrc, index) => {
                if (images.length <= index)
                  return (
                    <Img
                      src={emptyState}
                      loading="lazy"
                      className={`hero-image ${IMAGE_CLASSNAMES[index]}`}
                    />
                  );
                return (
                  <Img
                    src={images[index]}
                    loading="lazy"
                    className={`hero-image ${IMAGE_CLASSNAMES[index]}`}
                  />
                );
              })}
          {children}
        </InnerContainer>
      </Container>
    </div>
  );
}

HeroGrid.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.any,
};

export default HeroGrid;
