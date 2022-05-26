import React, { useCallback } from 'react';
import DatePicker from 'react-datepicker';
import styled from 'styled-components';
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';

const TimeField = styled(DatePicker)`
  display: block;
  box-sizing: border-box;
  width: 100%;
  min-height: 46px;
  padding: 10px 14px;
  color: rgb(26, 26, 26);
  font-size: 16px;
  line-height: 1.5;
  word-wrap: normal;
  background: #ffffff;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  -webkit-appearance: none;
  appearance: none;
`;

function OverrideTimeRange({ id, startDate, endDate, onChange }) {
  const onStartTimeChange = useCallback(newDate => {
    onChange(id, { startDate: DateTime.fromJSDate(newDate), endDate });
  });

  const onEndTimeChange = useCallback(newDate => {
    onChange(id, { endDate: DateTime.fromJSDate(newDate), startDate });
  });

  return (
    <div className="d-flex flex-items-center">
      <TimeField
        selected={startDate.toJSDate()}
        onChange={onStartTimeChange}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={15}
        timeCaption="Start Time"
        dateFormat="h:mm aa"
      />
      <b className="px-2">-</b>
      <TimeField
        selected={endDate.toJSDate()}
        onChange={onEndTimeChange}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={15}
        timeCaption="End Time"
        dateFormat="h:mm aa"
      />
    </div>
  );
}

OverrideTimeRange.propTypes = {
  endDate: PropTypes.object,
  startDate: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

export default OverrideTimeRange;
