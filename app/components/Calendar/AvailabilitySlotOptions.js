import React, { useState, memo } from 'react';
import PropTypes from 'prop-types';
import { cadenzoPrimary } from 'utils/CssVariables';
import styled from 'styled-components';
import { useDeepCompareMemo } from 'utils/customHooks';
import SlotDetails from './SlotDetails';

const SlotOption = styled.button`
  color: ${cadenzoPrimary};
  display: flex;
  box-sizing: border-box;
  font-size: 14px;
  font-weight: bold;
  justify-content: space-around;
  padding: 0;
  color: black;
`;

const Wrapper = styled.div`
  background-color: #f6f6fa !important;
`;

function AvailabilitySlotOptions({ availabilitySlotsForDay, onClick }) {
  const [selectedOption, setSelectedOption] = useState(-1);

  const onSelectOption = (index, slot) => {
    setSelectedOption(index);
    setSelectedOption(selectedOption);
    onClick(slot);
  };

  const RenderedContent = useDeepCompareMemo(
    () => (
      <>
        {availabilitySlotsForDay.map((slot, index) => (
          <div className="d-flex flex-column full-width">
            <SlotOption onClick={() => onSelectOption(index, slot)}>
              <SlotDetails slot={slot} />
            </SlotOption>
          </div>
        ))}
      </>
    ),
    [availabilitySlotsForDay, selectedOption],
  );
  return <Wrapper>{RenderedContent}</Wrapper>;
}

AvailabilitySlotOptions.propTypes = {
  availabilitySlotsForDay: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default memo(AvailabilitySlotOptions);
