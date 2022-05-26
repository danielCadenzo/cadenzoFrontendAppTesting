'use es6';

import React from 'react';
import styled from 'styled-components';

const CalendarGlimmerWrapper = styled.span`
  width: ${({ width }) => width || '395px'};
  height: ${({ height }) => height || '346px'};
  background: #f6f7f8;
  background-image: linear-gradient(
    to right,
    #f6f7f8 0%,
    #edeef1 20%,
    #f6f7f8 40%,
    #f6f7f8 100%
  );
  background-repeat: no-repeat;
  background-size: 800px 346px;
  position: relative;
  display: block !important;

  animation: shimmer;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-timing-function: linear;

  -webkit-animation-duration: 1s;
  -webkit-animation-fill-mode: forwards;
  -webkit-animation-iteration-count: infinite;
  -webkit-animation-name: shimmer;
  -webkit-animation-timing-function: linear;

  -o-animation-duration: 1s;
  -o-animation-fill-mode: forwards;
  -o-animation-iteration-count: infinite;
  -o-animation-name: shimmer;
  -o-animation-timing-function: linear;

  @-webkit-keyframes shimmer {
    0% {
      background-position: -468px 0;
    }
    100% {
      background-position: 468px 0;
    }
  }

  @-o-keyframes shimmer {
    0% {
      background-position: -468px 0;
    }
    100% {
      background-position: 468px 0;
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -468px 0;
    }
    100% {
      background-position: 468px 0;
    }
  }
`;

export const CalendarShimmer = props => <CalendarGlimmerWrapper {...props} />;
