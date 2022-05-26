/**
 *
 * SupportPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { compose } from 'redux';
import styled from 'styled-components';
import { useInjectSaga } from 'utils/injectSaga';
import support1 from 'images/support1.png';
import support2 from 'images/support2.png';
import saga from './saga';

const ImageWrapper = styled.img`
  max-width: 720px;
  width: 100%;
`;

export function SupportPage() {
  useInjectSaga({ key: 'supportPage', saga });

  return (
    <div>
      <Helmet>
        <title>SupportPage</title>
        <meta name="description" content="Description of SupportPage" />
      </Helmet>
      <div
        style={{ backgroundColor: '#fafafa' }}
        className="full-height full-width d-flex flex-column flex-justify-center flex-items-center text-center mt-5"
      >
        <p className="work-sans-black">
          {' '}
          If you require support with your tickets our support team is standing
          by and can be reached either by phone or email.{' '}
        </p>
        <a href="tel:9164979721" className="work-sans-black mt-2">
          {' '}
          Phone: 918-497-9721{' '}
        </a>
        <a
          href="mailto: marc@cadenzotickets.com"
          className="work-sans-black color-black mt-2"
        >
          {' '}
          Email: marc@cadenzotickets.com{' '}
        </a>

        <p className="work-sans-black mt-5 text-center mb-2">
          If you have questions regarding tickets, emails, or viewing the event.
          Don't hesitate to reach out.
        </p>

        <ImageWrapper src={support1} />
        <ImageWrapper src={support2} />
      </div>
    </div>
  );
}

SupportPage.propTypes = {
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

export default compose(withConnect)(SupportPage);
