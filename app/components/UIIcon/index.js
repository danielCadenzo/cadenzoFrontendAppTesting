/**
 *
 * UiIcon
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import IconTypes from './IconTypes';

function UIIcon({ name, className }) {
  const Icon = IconTypes[name];
  return (
      <Icon className={className} />
  );
}

UIIcon.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
};

export default memo(UIIcon);
