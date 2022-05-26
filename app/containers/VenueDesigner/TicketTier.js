'use es6';

import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import AddIcon from '@material-ui/icons/Add';
import { COLOR_SWATCHES } from './constants';

const TicketTierContainer = styled.div`
  background: white;
  display: flex;
  align-items: start;
  border-radius: 4px;
  padding: 12px;
  width: 100%;
  margin: 0 24px;
`;

const TierColorCircle = styled.div`
  border-radius: 50%;
  height: 48px;
  width: 48px;
  display: flex;
  align-self: center;
  background-color: ${({ color }) => color};
  justify-content: center;

  & svg {
    display: none;
  }

  &:hover svg {
    display: block;
  }
`;

const DeleteButton = styled.button`
  cursor: pointer;
  display: flex;
  align-self: center;
  border-radius: 50%;
`;

const PickerContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  display: flex;
  flex-wrap: wrap;
  min-height: 0;
  min-width: 0;
  margin-top: 8px;
`;

const TicketTier = ({
  label,
  seatAmount = 0,
  color,
  price = 10.0,
  onUpdateSeatCount,
  onDeleteTier,
  onNameChange,
  onPriceChange,
  seatsAreSelected,
}) => {
  const [isColorPickerOpen, updateIsColorPickerOpen] = useState(false);

  const handleColorCircleClick = e => {
    if (seatsAreSelected) {
      onUpdateSeatCount(e);
    } else {
      updateIsColorPickerOpen(!isColorPickerOpen);
    }
  };

  const handlePriceChange = e => {
    e.persist();
    if (e.target.value >= 0) {
      onPriceChange(e);
    }
  };

  return (
    <div className="d-flex flex-column">
      <div className="d-flex mt-3">
        <TicketTierContainer>
          <TierColorCircle
            className="flex-shrink-0"
            color={color}
            onClick={handleColorCircleClick}
          >
            {seatsAreSelected && (
              <AddIcon
                className="flex-self-center"
                fontSize="large"
                fill="white"
              />
            )}
          </TierColorCircle>
          <div className="d-flex ml-3 flex-column">
            <TextField
              className="f4 work-sans-black"
              value={label}
              onChange={onNameChange}
            />
            <div className="d-flex flex-justify-between flex-items-center">
              <div className="d-flex flex-justify-between flex-items-center">
                $
                <TextField
                  className="f4 work-sans-black ml-1"
                  value={price.toFixed(2)}
                  onChange={handlePriceChange}
                  type="number"
                  min="0"
                  step={0.25}
                  inputProps={{
                    min: '0',
                    step: '.25',
                  }}
                />
              </div>
              <p className="f5 work-sans-black flex-shrink-0">
                {seatAmount} seats
              </p>
            </div>
          </div>
          <DeleteButton onClick={onDeleteTier}>
            <DeleteForeverIcon />
          </DeleteButton>
        </TicketTierContainer>
      </div>
      <PickerContainer>
        {isColorPickerOpen && (
          <div className="m-2 d-flex flex-wrap">
            {COLOR_SWATCHES.map(colorSwatch => (
              <TierColorCircle
                className="flex-shrink-0 m-1"
                color={colorSwatch}
              />
            ))}
          </div>
        )}
      </PickerContainer>
    </div>
  );
};

export default TicketTier;

TicketTier.propTypes = {
  label: PropTypes.string.isRequired,
  seatAmount: PropTypes.number,
  color: PropTypes.string.isRequired,
  onUpdateSeatCount: PropTypes.func.isRequired,
  onDeleteTier: PropTypes.func.isRequired,
  onNameChange: PropTypes.func.isRequired,
  seatsAreSelected: PropTypes.bool.isRequired,
  price: PropTypes.number,
  onPriceChange: PropTypes.func,
};
