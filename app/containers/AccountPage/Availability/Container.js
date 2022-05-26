import React from 'react';
import PropTypes from 'prop-types';
import { OVERRIDE_CALENDAR_FIELD } from '../constants';
import DateSelect from '../DaySelect';

function Container({
  children,
  setFieldValue,
  formValues,
  onModalTimeRangeChange,
}) {
  return (
    <div
      className="d-flex flex-column rounded p-3 flex-items-center"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      <b className="f3">Select the date(s) you want to assign specific hours</b>
      <div className="my-2 " style={{ position: 'relative' }}>
        {children.slice(0, -1)}
      </div>
      <div className="d-flex flex-column">
        <b className="f5">What hours is this space available?</b>
        <DateSelect
          showDayToggle={false}
          day={OVERRIDE_CALENDAR_FIELD}
          setFieldValue={setFieldValue}
          formValues={formValues}
          onUpdate={onModalTimeRangeChange}
        />
      </div>
      {children.slice(-1)}
    </div>
  );
}

Container.propTypes = {
  children: PropTypes.any,
  setFieldValue: PropTypes.func.isRequired,
  formValues: PropTypes.object,
  onModalTimeRangeChange: PropTypes.func,
};

export default Container;
