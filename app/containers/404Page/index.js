/**
 *
 * 404Page
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { compose } from 'redux';
import './index.scss';

export function Page404() {
  return (
    <div className="notfoundpage">
      <Helmet>
        <title>404Page</title>
        <meta name="description" content="Description of 404Page" />
      </Helmet>
      <div className="content">
        <canvas className="snow" id="snow" />
        <div className="main-text">
          <h1>
            <p>This page has gone missing.</p>
          </h1>
          <a className="home-link" href="/">
            Head Back Home
          </a>
        </div>
        <div className="ground">
          <div className="mound">
            <div className="mound_text">404</div>
            <div className="mound_spade" />
          </div>
        </div>
      </div>
    </div>
  );
}

Page404.propTypes = {
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

export default compose(
  withConnect,
  memo,
)(Page404);
