/**
 *
 * HomePage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import Button from 'components/Button';
import { compose } from 'redux';
import H2 from 'components/H2';
import Footer from 'containers/EventLandingPage/UniversalFooter';
import { darkgrey } from 'utils/CssVariables';
import bannerHome from 'images/backgrounds/banner_home.jpg';
import screenshot from 'images/backgrounds/temp_screenshot.png';
import messages from './messages';

const Container = styled.div`
  background-color: #fafafa;
`;

const ListItem = styled.li`
  font-family: 'Roboto', 'Circular', '-apple-system', 'BlinkMacSystemFont',
    'Helvetica Neue', sans-serif;
`;

const Banner = styled.div`
  padding: 200px 40px 100px;
  border-bottom: 1px solid #000;
  background-color: #f7f7f7;
  background-image: url(${bannerHome});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

const BannerTextWrapper = styled.div`
  background-color: black;
  padding: 8px;
`;

const Headline = styled.h2`
  font-family: 'Roboto', 'Circular', '-apple-system', 'BlinkMacSystemFont',
    'Helvetica Neue', sans-serif;
  font-weight: bold;
  font-size: 32px;
  padding: 8px 0;
`;

const ProductImage = styled.img`
  max-width: 300px;
  width: 100%;
  display: block !important;
  padding: 0 12px;
  height: auto;
  object-fit: contain;
`;

export function HomePage() {
  return (
    <Container>
      <div className="">
        <Helmet>
          <title>Cadenzo</title>
          <meta name="description" content="Description of HomePage" />
        </Helmet>
        <div>
          <Banner
            className="color-white d-flex flex-column flex-items-center"
            style={{ backgroundColor: darkgrey }}
          >
            <BannerTextWrapper className="text-center">
              <h1 className="h1">
                <FormattedMessage {...messages.header} />
              </h1>
              <H2>
                <FormattedMessage {...messages.headerSubtitleAlt} />
              </H2>
            </BannerTextWrapper>
            <Button className="f2 px-4 py-3">Book now</Button>
          </Banner>

          <div className="d-flex flex-column p-4">
            <div className="d-flex full-width roboto flex-justify-between">
              <div style={{ maxWidth: '50%' }} className="d-flex flex-column">
                <Headline className="text-bold">
                  {' '}
                  1. Streamline your booking{' '}
                </Headline>
                <p className="f3 roboto">
                  Gone are the days of cold calling to book a show. Cadenzo
                  brings the shows to you so you can focus on what you do best.
                  Performing.
                </p>
              </div>
              <ProductImage src={screenshot} />
            </div>
          </div>

          <div className="d-flex flex-column p-4">
            <div className="d-flex text-right flex-row-reverse full-width roboto flex-justify-between">
              <div
                style={{ maxWidth: '50%' }}
                className="d-flex flex-column p-3"
              >
                <Headline> 2. Manage your shows </Headline>
                <p className="f2 roboto">
                  Never forget a detail again. Cadenzo artists can easily manage
                  the big and small details of planning a show with tools
                  like...
                </p>

                <ul className="f3">
                  <ListItem>
                    <span>&#8226;</span>&nbsp;Artist and venue chat box
                  </ListItem>

                  <ListItem>
                    <span>&#8226;</span>&nbsp;Booking availability calendar
                  </ListItem>

                  <ListItem>
                    <span>&#8226;</span>&nbsp;Band member scheduling
                  </ListItem>

                  <ListItem>
                    <span>&#8226;</span>&nbsp;More coming soon
                  </ListItem>
                </ul>
              </div>
              <ProductImage src={screenshot} />
            </div>
          </div>
        </div>

        <div className="d-flex full-width roboto p-4 flex-justify-between">
          <div style={{ maxWidth: '50%' }} className="d-flex flex-column">
            <Headline className="text-bold"> 3. Discover new markets</Headline>
            <p className="f3 roboto">
              Want to play in a new city or plan a cross-country tour? With
              Cadenzo, your performing potential is limitless.
            </p>
          </div>
          <ProductImage src={screenshot} />
        </div>
      </div>

      <Footer />
    </Container>
  );
}

HomePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(withConnect)(HomePage);
