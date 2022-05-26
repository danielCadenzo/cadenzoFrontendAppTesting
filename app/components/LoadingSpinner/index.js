/**
 *
 * LoadingSpinner
 *
 */

import React, { memo } from 'react';
import Lottie from 'react-lottie';
import * as animationData from './cadenzo-loader.json';

function LoadingSpinner() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData.default,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  return (
    <Lottie
      options={defaultOptions}
      height={400}
      width={400}
      isStopped={false}
      isPaused={false}
    />
  );
}

LoadingSpinner.propTypes = {};

export default memo(LoadingSpinner);
