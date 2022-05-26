/**
 *
 * ReviewPage
 *
 */

import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { useInjectReducer } from 'utils/injectReducer';
import UIMain from 'components/UiMain';
import { withRouter } from 'react-router-dom';
import { getJsonFromUrl } from 'utils/helpers';
import makeSelectReviewPage from './selectors';
import reducer from './reducer';
import ReviewForm from './ReviewForm';

export function ReviewPage({ match }) {
  const {
    params: { reviewId},
  } = match;
  const urlParams = useMemo(() => getJsonFromUrl(), []);
  
  useInjectReducer({ key: 'reviewPage', reducer });

  return (
    <UIMain className="py-4">
      <Helmet>
        <title>Review</title>
        <meta name="description" content="Review | Cadenzo" />
      </Helmet>
      <div className="d-flex flex-column">
        <ReviewForm urlParams={urlParams} />
      </div>
    </UIMain>
  );
}

ReviewPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  reviewPage: makeSelectReviewPage(),
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
)(withRouter(ReviewPage));
