import React from 'react';
import styled from 'styled-components';
import CheckIcon from '@material-ui/icons/CheckRounded';
import CircleIcon from '@material-ui/icons/PanoramaFishEye';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import PropTypes from 'prop-types';
import { deviceMax } from '../../constants/ResponsiveSizing/deviceSize';

const BackDrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 15;
  height: 100%;
  background-color: #2a2a2ade;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Card = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  background-color: white;
  width: 60vw;
  border-radius: 20px;
  align-items: center;
  box-shadow: 0px 20px 20px 20px rgba(158, 144, 173, 0.05);
  padding: 20px;

  @media ${deviceMax.tablet} {
    width: 100vw;
  }
`;

const ExitIconContainer = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;

  svg {
    color: #cfc5d9;

    &:hover {
      cursor: pointer;
    }
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  margin-bottom: 20px;
  justify-content: center;
  align-items: center;
  text-align: center;

  h2 {
    font-family: sans-serif;
    font-weight: 800;
    font-size: 25px;
    font-style: normal;
    margin-bottom: 20px;
  }
  h5 {
    font-size: 15px;
    font-family: sans-serif;
    font-weight: 400;
    margin-bottom: 50px;
  }
`;

const IconWrapper = styled.div`
  position: relative;
  margin-bottom: 50px;
  svg {
    opacity: 0.2;
    color: #5926cc;
    height: 150px;
    width: 150px;
  }

  svg:last-of-type {
    position: absolute;
    left: 30px;
    opacity: 1;
    color: #5926cc;
    width: 90px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 30px;
  margin-top: 30px;
  text-align: center;
  button {
    border: 1px solid #5926cc;
    border-radius: 20px;
    background: #5926cc;
    color: white;
    padding: 30px;
    width: 190px;
    box-shadow: 0px 20px 20px 20px rgba(158, 144, 173, 0.05);
    &:hover {
      cursor: pointer;
    }
  }
`;

/*
  Use to display a card with backdrop after an completing some event  
  Props Description:
    header: Main text that displays on the card
    subtext: displays right under header text
    redirectOptions: An object that contains the titles of the two buttons and the redirect URL
*/
export function ConfirmationCard(props) {
  const { isOpen, onClose, enableExit, header, subtext } = props;
  return (
    <div data-testid="header">
      {isOpen && (
        <BackDrop data-testid={'Card'}>
          <Card>
            {enableExit && (
              <ExitIconContainer>
                <CloseRoundedIcon onClick={onClose} />
              </ExitIconContainer>
            )}
            <Content>
              <IconWrapper>
                <CircleIcon />
                <CheckIcon />
              </IconWrapper>
              <h2>{header}</h2>
              <h5>{subtext} </h5>
              <ButtonContainer>{props.children}</ButtonContainer>
            </Content>
          </Card>
        </BackDrop>
      )}
    </div>
  );
}


ConfirmationCard.propTypes = {
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  subtext: PropTypes.string.isRequired,
  enableExit: PropTypes.bool,
  header: PropTypes.string.isRequired,
  children: PropTypes.arrayOf(PropTypes.node),
};

export default ConfirmationCard;

