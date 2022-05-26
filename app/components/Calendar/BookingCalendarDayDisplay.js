import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { cadenzoPrimary } from 'utils/CssVariables';
import styled from 'styled-components';

const BookingSlotsAmt = styled.div`
  background-color: ${cadenzoPrimary};
  margin-left: auto;
  margin-right: auto;
  font-size: 18px;
  font-weight: bold;
  border-radius: 100%;
  width: 22px !important;
  height: 22px !important;
  color: white;
  vertical-align: middle;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 4px;
  font-family: 'Urbanist', 'Roboto', 'Circular', '-apple-system',
    'BlinkMacSystemFont', 'Helvetica Neue', sans-serif !important;

  ${({ isBlocked }) => isBlocked && 'background-color: '}
`;

const Wrapper = styled.div`
  box-shadow: 3px 0px 14px 2px rgb(89 38 204 / 9%);
  color: ${cadenzoPrimary};
  background-color: white;
  border-radius: 10px;
  border: 2px solid transparent;
  height: 100%;
  width: 100%;
  font-weight: bold;
  vertical-align: middle;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Work Sans', 'Circular', '-apple-system', 'BlinkMacSystemFont',
    'Helvetica Neue', sans-serif !important;

  &.selected {
    background-color: ${cadenzoPrimary};
    color: white;
  }
`;

const BookingCalendarDayDisplay = ({
  dayInfo,
  bookingInfo = null,
  onDayClick,
  modifiers,
}) => (
  <Wrapper
    className={[...modifiers].join(' ')}
    role="button"
    tabIndex="-1"
    onClick={onDayClick}
  >
    {dayInfo.format('D')}
    {bookingInfo && bookingInfo.amtSlotsOpen > 0 && (
      <Fragment>
        <BookingSlotsAmt>{bookingInfo.amtSlotsOpen}</BookingSlotsAmt>
      </Fragment>
    )}
  </Wrapper>
);

BookingCalendarDayDisplay.propTypes = {
  dayInfo: PropTypes.object,
  bookingInfo: PropTypes.object,
  onDayClick: PropTypes.func,
  modifiers: PropTypes.oneOfType(Set),
};

BookingCalendarDayDisplay.defaultProps = {
  modifiers: new Set([]),
};

export default BookingCalendarDayDisplay;
