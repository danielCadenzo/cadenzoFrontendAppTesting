import React, { memo, useState } from 'react';
import styled from 'styled-components';
import H2 from 'components/H2';
import UIIcon from 'components/UIIcon';
import { redirectToUrl } from 'utils/helpers';
import Routes from '../../data/Routes';

const Header = styled.div`
  background-color: black;
  background: linear-gradient(93.34deg, #5926cc 0%, #a84bf5 100%);
  width: 100%;
  height: 200px;
  margin-bottom: -25px;
  box-shadow: inset 0 0 0 1000px rgba(0, 0, 0, 0.4);
  background-size: auto;
  background-position: center;
  color: white !important;
`;

const OptionWrapper = styled.button`
  background-color: white;
  min-width: 200px;
  width: 30%;
  min-height: 200px;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  border: 3px solid #5926cc;
  border-radius: 12px;
  align-items: center;
  color: #5926cc !important;
  margin: 4px;

  &:hover {
    background-color: #5926cc !important;
    color: white !important;
  }
`;

function ProfileOnboarding() {
  return (
    <div>
      <Header className="p-4">
        <H2 className="color-white f1 text-bold">You're in!</H2>
        <p>
          This will your dashboard, the main hub for everything Cadenzo. You
          will be able to edit your profile, bookings and your availability
          here.
        </p>
        <p>Let’s get started by setting up your first profile!</p>
      </Header>

      <div className="d-flex flex-wrap flex-justify-around">
        <OptionWrapper
          onClick={() => redirectToUrl(Routes.createVenueProfile())}
          role="button"
        >
          <UIIcon name="Add" />
          <h3 className="h3"> Start a Venue Profile </h3>
        </OptionWrapper>

        <OptionWrapper
          onClick={() => redirectToUrl(Routes.createArtistProfile())}
          role="button"
        >
          <UIIcon name="Add" />
          <h3 className="h3"> Start a Artist Profile </h3>
        </OptionWrapper>
      </div>
    </div>
  );
}

export default ProfileOnboarding;
