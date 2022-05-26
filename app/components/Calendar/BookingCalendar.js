/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import 'react-dates/initialize';
import './datepicker.scss';
import React, { useEffect, useState, Fragment, memo } from 'react';
import PropTypes from 'prop-types';
import { DateTime } from 'luxon';
import { useInjectReducer } from 'utils/injectReducer';
import { connect } from 'react-redux';
import { compose } from 'redux';
import DayPickerSingleDateControllerWrapper from './MonthCalendar';
import SingleDatePicker from './SingleDatePicker';
import BookingCalendarDayDisplay from './BookingCalendarDayDisplay';
import BookingCalendarLineupContainer from './BookingCalendarLineupContainer';
import { CalendarShimmer } from './Glimmer';
import reducer from './reducer';
import { fetchCalendarRange } from './actions';
import { getRequestState, getAvailabilityForProfile } from './selectors';

function BookingCalendar({
  showAvailabilityDetail,
  numberOfMonths = 1,
  id = 'booking-calendar',
  isDayHighlighted,
  onDayClick,
  isForVenue = true,
  creatorId,
  isDayBlocked,
  className,
  onUpdate,
  useDatePicker,
  onSlotSelected,
  initialDate,
  availabilityByDate,
  isCalendarLoaded,
  fetchCalendarDateRange,
}) {
  const [dateSelected, onDaysChanged] = useState(null);
  const [hasDatePickerBeenOpened, setHasDatePickerBeenOpened] = useState(false);
  const [bookingSlots, updateBookingSlots] = useState(null);
  useInjectReducer({ key: 'bookingCalendar', reducer });

  const handleUpdate = (...rest) => {
    if (onUpdate) onUpdate(...rest);
  };

  useEffect(() => {
    getNextFourMonths();
  }, [creatorId, isForVenue]);

  const onDateSelect = (date, bookingDetails) => {
    // get date
    onDaysChanged(date);
    updateBookingSlots(bookingDetails);
    if (!hasDatePickerBeenOpened) setHasDatePickerBeenOpened(true);
  };

  const onBackClick = () => setHasDatePickerBeenOpened(false);

  const renderCalendarDate = (day, modifiers) => {
    if (!day || !availabilityByDate) return null;
    return (
      <BookingCalendarDayDisplay
        dayInfo={day}
        modifiers={modifiers}
        bookingInfo={availabilityByDate[day.toISOString().slice(0, 10)]}
        calendarDatesByDate={availabilityByDate}
        onDayClick={() => {
          const availability = availabilityByDate[day.toISOString().slice(0, 10)];
          if (onDayClick) onDayClick(day, availability);
          onDateSelect(day, availability);
        }}
      />
    );
  };

  const isDayBlockedHandler = day => {
    if (isDayBlocked) return isDayBlocked(day, availabilityByDate);

    if (Object.keys(availabilityByDate).length) return defaultIsBlocked(day);

    return false;
  };

  const defaultIsBlocked = day =>
    !(
      availabilityByDate[day.toISOString().slice(0, 10)] &&
      availabilityByDate[day.toISOString().slice(0, 10)].isAvailable
    );

  const getNextFourMonths = () => {
    
    const startRange = DateTime.local().setZone("America/New_York")
    const endRange = DateTime.local().setZone("America/New_York").plus({days: 14})
    const dateStartFinal = new Date(startRange)
    const dateEndFinal = new Date(endRange)

    const iterations = new Array(6).fill(null);
    iterations.forEach(() => {
      fetchCalendarDateRange(isForVenue, {
        id: creatorId,
        showAvailabilityDetail,
        startDate: dateStartFinal,
        endDate: dateEndFinal,
      });
      startRange.plus({days: 14});
      endRange.plus({days: 14});
    });
  };
  useEffect(() => {
    if (
      initialDate &&
      !dateSelected &&
      availabilityByDate &&
      Object.keys(availabilityByDate).length > 0
    ) {
      const initialDateInfo = DateTime.fromJSDate(initialDate.toDate());
      onDaysChanged(initialDateInfo);
      const booking = availabilityByDate[initialDate.toISOString().slice(0, 10)];
      if (booking) updateBookingSlots(booking);
    }
  }, [availabilityByDate, initialDate]);

  const CalendarComponent = useDatePicker
    ? SingleDatePicker
    : DayPickerSingleDateControllerWrapper;

  const shimmerProps = useDatePicker ? { width: '150px', height: '40px' } : {};
  return (
    <div className="full-width">
      {isCalendarLoaded && (
        <div className="d-flex full-height">
          <CalendarComponent
            id={id}
            className={className}
            initialDate={initialDate}
            isDayHighlighted={isDayHighlighted}
            numberOfMonths={numberOfMonths}
            onDayClick={onDayClick}
            isDayBlocked={isDayBlockedHandler}
            renderDayContents={renderCalendarDate}
            daySize={50}
          />
          {bookingSlots && hasDatePickerBeenOpened && (
            <BookingCalendarLineupContainer
              availabilitySlot={bookingSlots}
              onChange={onSlotSelected}
              onBackClick={onBackClick}
              isVenue={isForVenue}
            />
          )}{' '}
        </div>
      )}
      {!isCalendarLoaded && <CalendarShimmer {...shimmerProps} />}
    </div>
  );
}

BookingCalendar.propTypes = {
  availabilityByDate: PropTypes.object,
  numberOfMonths: PropTypes.number,
  id: PropTypes.string,
  isDayHighlighted: PropTypes.bool,
  isCalendarLoaded: PropTypes.bool,
  fetchCalendarDateRange: PropTypes.func.isRequired,
  hideBookingSlots: PropTypes.bool,
  onDayClick: PropTypes.func,
  isForVenue: PropTypes.bool,
  creatorId: PropTypes.string,
  isDayBlocked: PropTypes.func,
  className: PropTypes.string,
  onUpdate: PropTypes.func,
  useDatePicker: PropTypes.bool,
  onSlotSelected: PropTypes.func,
  initialDate: PropTypes.any,
  defaultSlotStart: PropTypes.any,
  defaultSlotEnd: PropTypes.any,
  showAvailabilityDetail: PropTypes.bool,
};

BookingCalendar.defaultProps = {
  showAvailabilityDetail: false,
  hideBookingSlots: false,
};

const mapStateToProps = (state, props) => {
  const makeGetRequestStatus = getRequestState(state, props.creatorId);
  return {
    availabilityByDate: getAvailabilityForProfile(state, props.creatorId),
    isCalendarLoaded: makeGetRequestStatus(state),
  };
};

const mapDispatchToProps = {
  fetchCalendarDateRange: fetchCalendarRange,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
export default compose(
  withConnect,
  memo,
)(BookingCalendar);

