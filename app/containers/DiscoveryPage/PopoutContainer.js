import React from 'react';
import UIImageCarousel from 'components/UiImageCarousel/Loadable';
import styled from 'styled-components';
import VENUE_IMAGES_EMPTY_STATE from 'images/empty_states/venue_images.jpg';

const TEST_IMAGES = [VENUE_IMAGES_EMPTY_STATE];
const ImageWrapper = styled.div`
  -ms-flex-negative: 0 !important;
  -webkit-box-flex: 0 !important;
  -ms-flex-positive: 0 !important;
  -webkit-flex-grow: 0 !important;
  flex-grow: 0 !important;
  -webkit-flex-shrink: 0 !important;
  flex-shrink: 0 !important;
  width: 300px !important;
  height: 200px !important;
  border-radius: 12px !important;
`;

const OverflowClipper = styled.div`
  overflow: clip !important;
  border-radius: 12px;
`;

const ImageBackgroundContainer = styled.div`
  background: rgb(235, 235, 235);
`;

const Carousel = styled(UIImageCarousel)`
  vertical-align: bottom !important;
  height: 200px !important;
  width: 300px !important;
`;

function PopoutContainer(props) {
  const { venueInfo } = props;
  const CarouselImages = venueInfo.images.length
    ? venueInfo.images
    : TEST_IMAGES;
  const { name, images } = venueInfo;

  return (
    <div className="p-2">
      <ImageWrapper>
        <OverflowClipper>
          <ImageBackgroundContainer>
            <Carousel images={CarouselImages} />
          </ImageBackgroundContainer>
        </OverflowClipper>
      </ImageWrapper>

      <p className="f4">
        <b>{name}</b>
      </p>
    </div>
  );
}

export default PopoutContainer;
