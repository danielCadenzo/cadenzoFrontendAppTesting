/**
 *
 * VenueBookingPage
 *
 */

import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import styled from 'styled-components';
import { getActiveProfile } from 'data/selectors/authSelectors';
import { FormattedMessage } from 'react-intl';
import CreatorHeader from 'containers/VenueBookingPage/CreatorHeader';
import ShowMoreText from 'components/ShowMoreText/Loadable';
import Button from 'components/Button';
import { useWindowDimensions } from '../../utils/customHooks';
import AmenitySection from './AmenitySection';
import BookingForm from './BookingForm';
import messages from './messages';
import { deviceSizes } from '../../constants/ResponsiveSizing/deviceSize';
import MobileHeader from './MobileHeader';
import MobileDrawer from '../../components/MobileDrawer';
import ScrollingGallery from './ScrollingGallery';

const Container = styled.div`
  max-width: 1128px;
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 12px;
  padding: 0px 24px;
`;

const BoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #fff;
  box-shadow: 0 0 2px rgba(15, 15, 15, 0.28);
  
  overflow: scroll;
  align-items: center:
  overflow: scroll;
  

  }
`;

const Label = styled.h2`
  margin-top: 16px;
  margin-left: 15px;
  font-weight: 600;
  font-size: 18px;
`;

const PhotosLabel = styled(Label)`
  margin-top: 16px;
  margin-left: 15px;
  margin-bottom: 15px;
  font-weight: 600;
  font-size: 18px;
`;

const SubLabel = styled(Label)`
  margin-top: 16px;
  margin-left: 15px;
  font-weight: 600;
  font-size: 18px;
`;

const MarginContainer = styled.div`
  margin-left: 15px;
  margin-right: 15px;
  margin-bottom: 15px;
`;

const Description = styled.p`
  padding: 15px;
  font-weight: normal;
  font-style: normal;
  font-size: 13px !important;
  background-color: white;
`;

const SubInfo = styled(Description)`
  padding: 15px;
  padding-top: 5px;
  padding-bottom: 5px;
  font-weight: normal;
  font-style: normal;
  font-size: 13px !important;
  background-color: white;
`;

const Section = styled.div`
  position: relative;
  display: block;
  min-height: 40vh;
  padding-top: 85px;
  overflow: hidden;
  margin-bottom: 15px;
  margin-left: 15px;
  margin-right: 15px;
  padding: 15px;

  @media (max-width: 426px) {
    padding-top: 0px;
  }
`;

const LeftSide = styled.div`
  max-width: 700px;
  width: 66.6666%;
`;

const Card = styled.div`
  margin-left: 15px;
  margin-right: 15px;
`;

const Divider = styled.hr`
  border-top: 0.1px solid lightgray;
  border-radius: 5px;
  width: 87%;
  margin-top: 15px;
  margin-bottom: 15px;
`;

export function MainBody({ venue }) {
  const { anemities } = venue;
  const { width } = useWindowDimensions();
  const [bookingOpen, setBookingOpen] = useState();
  const handleChange = () => {
    setBookingOpen(!bookingOpen);
  };
  return (
    <BoxContainer>
      {width <= deviceSizes.tablet && (
        <>
          <MobileDrawer isOpen={bookingOpen}>
            <Button onClick={handleChange}> Request to Book</Button>
            {<BookingForm venue={venue} />}
          </MobileDrawer>
          <MobileHeader
            venue={venue}
            onClick={handleChange}
            bookingOpen={bookingOpen}
          />
          <MarginContainer>
            <Label> About </Label>
            <Description>
              <div className="">
                <ShowMoreText
                  expandInModal
                  lines={8}
                  more="Show more"
                  less="Show less"
                  anchorClass="my-anchor-css-class"
                  expanded={false}
                >
                  {venue.description}
                </ShowMoreText>
              </div>
            </Description>
          </MarginContainer>
          <Divider />
          <MarginContainer>
            <PhotosLabel> Venue Photos </PhotosLabel>
          </MarginContainer>

          <Section>
            <ScrollingGallery images={venue.images} />
          </Section>

          <Divider />
          <Card className="p-3">
            <h3 className="h3 my-3">
              <FormattedMessage {...messages.amenityHeader} />
            </h3>
            <AmenitySection amenities={anemities} />
          </Card>
          <Divider />
          <MarginContainer>
            <SubLabel> Capacity </SubLabel>
            <SubInfo>{venue.exactCapacity}</SubInfo>
          </MarginContainer>
        </>
      )}

      {width > deviceSizes.tablet && (
        <>
          <div
            className="d-flex flex-column flex-items-center full-width"
            style={{ backgroundColor: '#fafafa' }}
          >
            <CreatorHeader creatorProfile={venue} />
            <hr />
            <Container>
              <LeftSide>
                <Card className="p-3">
                  <h3 className="h3 my-3">
                    <FormattedMessage {...messages.amenityHeader} />
                  </h3>
                  <AmenitySection amenities={anemities} />
                </Card>
              </LeftSide>
              <BookingForm venue={venue} />
            </Container>
          </div>
        </>
      )}
    </BoxContainer>
  );
}

MainBody.propTypes = {
  dispatch: PropTypes.func.isRequired,
  venue: PropTypes.object,
};

const mapStateToProps = state => ({
  activeProfile: getActiveProfile(state),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(MainBody);
