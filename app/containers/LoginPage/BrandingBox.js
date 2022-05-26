import React from 'react';
import styled from 'styled-components';
import logo from 'images/icons/BETA_white.png';
import { device } from '../../constants/ResponsiveSizing/deviceSize';

const BoxContainer = styled.div`
  width: 280px;
  height: 580px;
  display: none;
  flex-direction: column;
  border-radius: 19px;
  background-color: ;
  box-shadow: 0 0 2px rgba(15, 15, 15, 0.28);
  position: relative;
  overflow: hidden;
  background: linear-gradient(58deg, #5926cc 20%, #a84bf5 100%);
  justify-content: center;

  @media ${device.laptop} {
    display: flex;
    height: 100%;
    border-radius: 0px;
    flex-shrink: 0; /* shrinks to 0 to apply 70% width*/
    flex-basis: 50%; /* sets initial width to 70% */
  }
`;

const TopContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
`;

const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const BottomText = styled.h5`
  text-align: center;
  color: #fff;
  font-weight: 500;
  font-size: 1.5vw;
  z-index: 10;
  margin: 0;
  margin-top: 7px;
  @media ${device.laptop} {
    color: #ffff;
  }
`;
const Image = styled.img`
  width: 50%;
  margin-left: auto;
  margin-right: auto;
  display: block;
  padding-bottom: 80px;
`;

export function BrandingBox(props) {
  return (
    <BoxContainer>
      <TopContainer>
        <Image width={350} alt="Cadenzo" src={logo} />
        <BottomText>
          The booking tool you can’t believe didn’t already exist.{' '}
        </BottomText>
        <HeaderContainer />
      </TopContainer>
    </BoxContainer>
  );
}
