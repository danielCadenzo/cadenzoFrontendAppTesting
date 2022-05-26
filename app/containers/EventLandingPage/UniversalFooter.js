import React, { memo } from 'react';
import styled from 'styled-components';
import insta from 'images/icons/instagram.svg';
import linkedin from 'images/icons/linkedin.svg';

const Wrapper = styled.footer`
  width: 100%;
  background-color: rgb(31, 38, 45);
  padding: 36px 80px;

  @media (max-width: 400px) {
    padding: 36px;
  }
`;

const Icon = styled.img`
  filter: invert(100%) sepia(91%) saturate(38%) hue-rotate(321deg)
    brightness(110%) contrast(110%);
`;

function UniversalFooter(props) {
  return (
    <Wrapper
      className="full-width d-flex flex-column flex-self-end mt-auto 
        flex-justify-around flex-items-center color-white"
    >
      <div className="d-flex full-width flex-wrap">
        <ul className="m-4">
          <li>
            <h3 className="text-bold"> About </h3>
          </li>
          <li>
            <a>
              <h3 className="my-3"> How Cadenzo Works? </h3>
            </a>
          </li>
          <li>
            <a>
              <h3 className="my-3"> Cadenzo for Venues </h3>
            </a>
          </li>
          <li>
            <a>
              <h3 className="my-3"> Cadenzo for Entertainers </h3>
            </a>
          </li>

          <li>
            <a>
              <h3 className="my-3"> Careers </h3>
            </a>
          </li>
        </ul>

        <ul className="m-4">
          <li>
            <h3 className="text-bold"> Host </h3>
          </li>
          <li>
            <a>
              <h3 className="my-3"> Host your Venue </h3>
            </a>
          </li>
          <li>
            <a>
              <h3 className="my-3"> Host Events </h3>
            </a>
          </li>
        </ul>

        <ul className="m-4">
          <li>
            <h3 className="text-bold"> Support </h3>
          </li>
          <li>
            <a>
              <h3 className="my-3"> Help </h3>
            </a>
          </li>
          <li>
            <a>
              <h3 className="my-3"> Streaming Events </h3>
            </a>
          </li>

          <li>
            <a>
              <h3 className="my-3"> Cancellation </h3>
            </a>
          </li>
        </ul>
      </div>

      <div className="d-flex flex-column full-width">
        <hr className="full-width" />
        <div className="d-flex full-width flex-justify-between flex-items-center pb-6">
          <div>
            &copy; Cadenzo Inc. All Rights Reserved &middot;
            <a className="px-1" href="/privacy">
              Privacy
            </a>{' '}
            &middot;
            <a className="px-1" href="/terms">
              Terms
            </a>
          </div>

          <div className="d-flex flex-nowrap">
            <a
              target="_blank"
              href="https://www.instagram.com/cadenzotickets/"
              className="px-2"
            >
              <Icon src={insta} />
            </a>
            <a
              target="_blank"
              href="https://www.linkedin.com/company/cadenzo/"
              className="px-2"
            >
              <Icon src={linkedin} />
            </a>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

export default memo(UniversalFooter);
