import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

const ZoomButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: fit-content;
  height: 100px;
  position: absolute !important;
  z-index: 3;
  background-color: white;
  margin: 12px;
`;

const ZoomButton = styled.button`
  width: 100%;
  height: 100%;
  cursor: pointer !important;
`;

function ZoomController({ onIncreaseClick, onDecreaseClick }) {
  return (
    <ZoomButtonContainer className="shadow">
      <ZoomButton className="border-bottom" onClick={onIncreaseClick}>
        <AddIcon />
      </ZoomButton>
      <ZoomButton className="border-top" onClick={onDecreaseClick}>
        <RemoveIcon />
      </ZoomButton>
    </ZoomButtonContainer>
  );
}

ZoomController.propTypes = {
  onIncreaseClick: PropTypes.func.isRequired,
  onDecreaseClick: PropTypes.func.isRequired,
};

export default ZoomController;
