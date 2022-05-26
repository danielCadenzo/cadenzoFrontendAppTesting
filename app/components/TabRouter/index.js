/**
 *
 * TabRouter
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

function TabRouter() {
  return (
    <div>
      <FormattedMessage {...messages.header} />
    </div>
  );
}

TabRouter.propTypes = {};

export default memo(TabRouter);
