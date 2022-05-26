'use es6';

import React, { Fragment } from 'react';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import Routes from 'data/Routes';
import PropTypes from 'prop-types';
import UIImageCarousel from 'components/UiImageCarousel/Loadable';
import VENUE_IMAGES_EMPTY_STATE from 'images/empty_states/venue_images.jpg';
import messages from './messages';

const TEST_IMAGES = [VENUE_IMAGES_EMPTY_STATE];

const ListingWrapper = styled.a`
  display: flex;
  flex-direction: column;
  border-bottom: 2px solid #dadada;
  padding-bottom: 4px;
  flex: 0 0 100%;
  margin-bottom: 20px;
  width: 555px;
  height: 527px;

  min-width: 555px;
  min-height: 527px;

  background: #ffffff;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1);
  border-radius: 18px;

  @media (min-width: 768px) {
    flex: 0 0 27%;
  }

  @media (min-width: 1024px) {
    flex: 0 0 21%;
  }
`;

const ImageWrapper = styled.div`
  -ms-flex-negative: 0 !important;
  -webkit-box-flex: 0 !important;
  -ms-flex-positive: 0 !important;
  -webkit-flex-grow: 0 !important;
  flex-grow: 0 !important;
  -webkit-flex-shrink: 0 !important;
  flex-shrink: 0 !important;
  width: 554.69px !important;
  height: 306px !important;
  border-radius: 12px !important;
`;

const OverflowClipper = styled.div`
  overflow: clip !important;
  border-radius: 12px;
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
  width: 100%;
  height: 100%;
`;

const ImageBackgroundContainer = styled.div`
  background: rgb(235, 235, 235);
  width: 100%;
  height: 100%;
`;

const Carousel = styled(UIImageCarousel)`
  vertical-align: bottom !important;
  width: 100%;
  height: 100%;

  @media (max-width: 600px) {
    width: 100%;
    height: 100%;
  }
`;

const Breaker = styled.hr`
  width: 100px;
  max-width: 100px;
  margin: 8px 0px;
`;

const VenueTypeText = styled.h3`
  font-family: 'Work Sans';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #9f9f9f;
`;

const DescriptionText = styled.p`
  font-family: 'Work Sans';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;

  color: #495057;
`;

function VenueSidebarItem({ venue }) {
  const CarouselImages = venue.images.length ? venue.images : TEST_IMAGES;
  return (
    <ListingWrapper
      href={Routes.venueBookingPage(venue.id)}
      rel="noopener noreferrer"
      className="pt-1"
      style={{ zIndex: 1 }}
    >
      <ImageWrapper>
        <OverflowClipper>
          <ImageBackgroundContainer>
            <Carousel images={CarouselImages} />
          </ImageBackgroundContainer>
        </OverflowClipper>
      </ImageWrapper>
      <div className="pl-2 mt-2">
        <VenueTypeText className="text-light roboto f5">
          <FormattedMessage {...messages[venue.spaceType]} />
        </VenueTypeText>
        <p className="text-light roboto f3">{venue.name}</p>
        <Breaker />
        <DescriptionText className="text-light f4 color-black">
          {venue.description}
        </DescriptionText>
        <VenueTypeText className="f5 color-gray mt-2">
          {venue.anemities.slice(0, 2).map((amenity, index, arr) => (
            <Fragment>
              <FormattedMessage {...messages[amenity]} />
              {index !== arr.length - 1 ? (
                <span className="px-1">&middot;</span>
              ) : null}
            </Fragment>
          ))}
        </VenueTypeText>

        <div>
          <button
            type="button"
            className="d-flex p-2 full-width flex-justify-end color-primary"
          >
            View more &#8594;
          </button>
        </div>
      </div>
    </ListingWrapper>
  );
}

VenueSidebarItem.propTypes = {
  venue: PropTypes.object.isRequired,
};

export default VenueSidebarItem;
