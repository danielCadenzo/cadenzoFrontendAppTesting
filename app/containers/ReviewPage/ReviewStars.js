import React, { useState } from 'react';
import styled from 'styled-components';

const StarArea = styled.span`
  width: 50px;
  height: 50px;
  display: block;
  position: relative;
  color: #aaa;
  font-size: 3em;
  line-height: 50px;
  cursor: pointer;
  z-index: 10;
  text-align: center;

  &:before {
    width: 50px;
    height: 50px;
    content: '★';
    display: inline-block;
    color: #95a5a6;
    position: absolute;
    left: 0;
    top: -1px;
    opacity: 0;

    z-index: -1;
  }
  &:after {
    width: 50px;
    height: 50px;
    content: '★';
    display: inline-block;
    color: #f1c40f;
    position: absolute;
    left: 0;
    top: -1px;
    opacity: 0;
    z-index: -2;
  }
`;

const StarContainer = styled.button`
  background-color: transparent;
  border: 0;
  outline: 0;

  &:hover ${StarArea} {
    color: #999;
  }

  &.active ${StarArea} {
    -webkit-animation: starbackground 500ms 1;
    -moz-animation: starbackground 500ms 1;
    -o-animation: starbackground 500ms 1;
    animation: starbackground 500ms 1;
    animation-delay: 250ms;
    animation-fill-mode: forwards;
    &:before {
      -webkit-animation: staranimation 250ms 1;
      -moz-animation: staranimation 250ms 1;
      -o-animation: staranimation 250ms 1;
      animation: staranimation 250ms 1;
    }
    &:after {
      -webkit-animation: staranimation 350ms 1;
      -moz-animation: staranimation 500ms 1;
      -o-animation: staranimation 500ms 1;
      animation: staranimation 500ms 1;
      animation-delay: 250ms;
    }
  }

  @-webkit-keyframes staranimation {
    0% {
      opacity: 0;
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 0;
      transform: scale(2);
      top: -1px;
    }
  }
  @-moz-keyframes staranimation {
    0% {
      opacity: 0;
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 0;
      transform: scale(2);
      top: -1px;
    }
  }
  @-o-keyframes staranimation {
    0% {
      opacity: 0;
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 0;
      transform: scale(2);
      top: -1px;
    }
  }
  @keyframes staranimation {
    0% {
      opacity: 0;
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 0;
      transform: scale(2);
      top: -1px;
    }
  }

  ///////////

  @-webkit-keyframes starbackground {
    0% {
      color: #aaaaaa;
    }
    100% {
      color: #f1c40f;
    }
  }
  @-moz-keyframes starbackground {
    0% {
      color: #aaaaaa;
    }
    100% {
      color: #f1c40f;
    }
  }
  @-o-keyframes starbackground {
    0% {
      color: #aaaaaa;
    }
    100% {
      color: #f1c40f;
    }
  }
  @keyframes starbackground {
    0% {
      color: #aaaaaa;
    }
    100% {
      color: #f1c40f;
    }
  }
`;

function ReviewStars() {
  const stars = [0, 0, 0, 0, 0];
  const [rating, setRating] = useState(3);
  return (
    <div>
      {stars.map((val, index) => (
        <StarContainer
          className={index <= rating ? 'active' : ''}
          onClick={() => setRating(index)}
        >
          <StarArea className={index < rating ? 'active' : ''}>★</StarArea>
        </StarContainer>
      ))}
    </div>
  );
}

export default ReviewStars;
