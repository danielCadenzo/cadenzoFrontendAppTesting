import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { cadenzoPrimary } from 'utils/CssVariables';
import styled from 'styled-components';
import { DateTime } from 'luxon';
import AvailabilitySlotOptions from './AvailabilitySlotOptions';
import UIIcon from '../UIIcon';

const SlotOption = styled.button`
  display: flex;
  flex-direction: column;
  min-width: 150px;
  box-sizing: border-box;
  font-size: 18px;
  justify-content: space-around;
  text-align: center;
  padding: 8px 0;
  border-bottom: 1px solid #c4c4c4;
  color: #495057;
  font-weight: normal;
  align-items: center;

  ${({ selected }) =>
    selected &&
    `
    background-color: ${cadenzoPrimary};
    color: white;
    height: fit-content;
  `}
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background: #f6f6fa;
  box-shadow: 0px 20px 20px 20px rgba(158, 144, 173, 0.05);
  width: 100%;
  max-width: 150px;
  max-height: 346px;
  height: 100%;
  overflow-y: auto;
`;

function BookingCalendarLineupContainer({
  availabilitySlot,
  onChange,
  onBackClick,
  isVenue,
}) {
  const dateObj = useMemo(
    () => DateTime.fromSQL(availabilitySlot.calendarDate),
    [availabilitySlot],
  );

  const onSlotSelected = useCallback(option => {
    const { endTime, startTime } = option;
    const startDate = DateTime.fromFormat(
      `${availabilitySlot.calendarDate} ${startTime}`,
      'yyyy-MM-dd HH:mm:ss',
      { zone: 'utc' },
    ).toLocal();
    const endDate = DateTime.fromFormat(
      `${availabilitySlot.calendarDate} ${endTime}`,
      'yyyy-MM-dd HH:mm:ss',
      { zone: 'utc' },
    ).toLocal();
    onChange(
      {
        startDate,
        endDate,
      },
      option,
    );
  });

  if (!availabilitySlot) return null;

  return (
    <Container>
      <button
        className="flex-self-start m-2"
        type="button"
        onClick={onBackClick}
      >
        <UIIcon name="back-arrow" />
      </button>
      <h3 className="h3 text-center flex-self-center py-2">
        {dateObj.toFormat('LLLL dd')}
      </h3>
      <p className="text-center">
        {availabilitySlot.availableSlots.length} slots available
      </p>

      <hr />
      {availabilitySlot.confirmedSlots.map(slot => {
        const dt = DateTime.fromISO(slot.startDate).toLocal();
        return (
          <SlotOption onClick={() => onSlotSelected(slot)}>
            <p>{isVenue ? slot.performer.name : slot.venue.name}</p>
            <p className="f4">{dt.toLocaleString(DateTime.TIME_SIMPLE)}</p>
            <p className="f5">${slot.guarantee}</p>
          </SlotOption>
        );
      })}
      <AvailabilitySlotOptions
        onClick={onSlotSelected}
        availabilitySlotsForDay={availabilitySlot.availableSlots}
      />
    </Container>
  );
}

BookingCalendarLineupContainer.defaultProps = {
  availabilitySlot: {
    amtSlotsFilled: 0,
    amtSlotsOpen: 1,
    availableSlots: [{ endTime: '23:00:00', startTime: '12:00:00' }],
    isAvailable: true,
    calendarDate: '2021-11-24',
  },
};

BookingCalendarLineupContainer.propTypes = {
  availabilitySlot: PropTypes.object,
  onChange: PropTypes.func,
  isVenue: PropTypes.bool,
};

export default BookingCalendarLineupContainer;
