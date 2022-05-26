import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { fromServerTime } from 'utils/dates';
import { DateTime } from 'luxon';

import messages from './messages';

export function BookingTableRow({
  booking,
  isActiveProfileVenue,
  onBookingClick,
}) {
  const profile = isActiveProfileVenue ? booking.performer : booking.venue;

  return (
    <div className="d-flex width-full border-bottom py-3 work-sans">
      <div className="d-table-cell col-3">
        {fromServerTime(booking.startDate).toLocaleString(DateTime.DATE_SHORT)}
      </div>
      <div className="d-table-cell col-3">
        {fromServerTime(booking.startDate).toLocaleString(DateTime.TIME_SIMPLE)}
      </div>
      <div className="d-table-cell col-3">{profile.name}</div>
      <div className="d-table-cell col-3 color-primary">
        <button
          onClick={() => onBookingClick(booking.id)}
          className="color-primary"
          type="button"
        >
          <FormattedMessage {...messages.viewDetails} />
        </button>
      </div>
    </div>
  );
}

BookingTableRow.propTypes = {
  booking: PropTypes.object,
  isActiveProfileVenue: PropTypes.bool,
  onBookingClick: PropTypes.func,
};

export default BookingTableRow;
