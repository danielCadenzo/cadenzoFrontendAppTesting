import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-form';
import RadioGroup from 'components/Form/RadioGroup';
import { DateTime } from 'luxon';

function BookingSlots({ onChange, bookingSlots, dateSelected, defaultSlot }) {
  const onSlotSelected = (value, option) => {
    const { endTime, startTime } = option.slotTimes;
    const startDate = DateTime.fromFormat(
      `${dateSelected.toISODate()} ${startTime}`,
      'yyyy-MM-dd HH:mm:ss',
      { zone: 'utc' },
    );
    const endDate = DateTime.fromFormat(
      `${dateSelected.toISODate()} ${endTime}`,
      'yyyy-MM-dd HH:mm:ss',
      { zone: 'utc' },
    );
    onChange({
      startDate,
      endDate,
    });
  };
  const defaultCheckedValue =
    defaultSlot && `${defaultSlot.startDate} - ${defaultSlot.endDate}`;
  return (
    <div>
      {bookingSlots && !!bookingSlots.length && (
        <h4 className="h4 my-2"> Available Slots </h4>
      )}
      {bookingSlots && !!bookingSlots.length && (
        <RadioGroup
          name="bookingCalendar.bookingSlots"
          onUpdate={onSlotSelected}
          defaultValue={defaultCheckedValue}
          options={bookingSlots.map(slot => ({
            slotTimes: slot,
            value: `${slot.startTime} - ${slot.endTime}`,
            label: `${DateTime.fromISO(slot.startTime).toLocaleString(
              DateTime.TIME_SIMPLE,
            )} - ${DateTime.fromISO(slot.endTime).toLocaleString(
              DateTime.TIME_SIMPLE,
            )}`,
          }))}
        />
      )}
    </div>
  );
}

BookingSlots.propTypes = {
  bookingSlots: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func.isRequired,
  dateSelected: PropTypes.object.isRequired,
};

export default BookingSlots;
