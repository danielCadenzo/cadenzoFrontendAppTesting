'use es6';

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Button from 'components/Button';
import Calendar from 'components/Calendar';
import { getXDaysAgo, toMonthDayString } from 'utils/dates';
import { useDidMount } from 'utils/customHooks';

const DateRangeTypes = {
  LAST_WEEK: 'LAST_WEEK',
  LAST_MONTH: 'LAST_MONTH',
  LAST_YEAR: 'LAST_YEAR',
  CUSTOM: 'CUSTOM',
};

const SETTLE_STATUS = {
  HOLD: 'HOLD_STATUS',
  CONFIRMED: 'CONFIRMED_STATUS',
  IN_SETTLEMENT: 'IN_SETTLEMENT_STATUS',
  SETTLED: 'SETTLED_STATUS',
};

const Wrapper = styled.div`
  min-width: 250px;
`;

function FilterSidebar({ onFilterChange }) {
  const dateTimeFromDateRange = dateTimeRange => {
    const now = new Date();
    switch (dateTimeRange || formState.dateRangeType) {
      case DateRangeTypes.LAST_WEEK: {
        return [getXDaysAgo(now, 7), now];
      }
      case DateRangeTypes.LAST_MONTH: {
        return [getXDaysAgo(now, 30), now];
      }
      case DateRangeTypes.LAST_YEAR: {
        return [getXDaysAgo(now, 365), now];
      }
      case DateRangeTypes.CUSTOM: {
        return [formState.customDateStart, formState.customDateEnd];
      }
      default:
        return null;
    }
  };

  const [formState, updateFormState] = useState({
    eventStatus: [
      SETTLE_STATUS.CONFIRMED,
      SETTLE_STATUS.SETTLED,
      SETTLE_STATUS.IN_SETTLEMENT,
      SETTLE_STATUS.HOLD,
    ],
    dateRangeType: DateRangeTypes.LAST_YEAR,
    customDateStart: dateTimeFromDateRange(DateRangeTypes.LAST_YEAR)[0],
    customDateEnd: new Date(),
  });
  const didMount = useDidMount();

  const handleDateRangeChange = evt => {
    const {
      target: { value },
    } = evt;
    updateFormState({
      ...formState,
      dateRangeType: value,
    });
  };

  const handleDateChange = dates => {
    const [startDate, endDate] = dates;
    updateFormState({
      ...formState,
      customDateStart: startDate,
      customDateEnd: endDate,
    });
  };

  const handleSettleStatus = evt => {
    const {
      target: { value },
    } = evt;
    const idx = formState.eventStatus.findIndex(val => val === value);
    const statuses = formState.eventStatus;
    if (idx < 0) {
      statuses.push(value);
      updateFormState({
        ...formState,
        eventStatus: statuses,
      });
    } else {
      statuses.splice(idx, 1);
      updateFormState({
        ...formState,
        eventStatus: statuses,
      });
    }
  };

  const {
    dateRangeType,
    eventStatus,
    customDateStart,
    customDateEnd,
  } = formState;

  useEffect(() => {
    handleDateChange(dateTimeFromDateRange());
  }, [dateRangeType]);

  useEffect(() => {
    if (didMount) {
      onFilterChange(formState);
    }
  }, [didMount]);

  return (
    <Wrapper className="full-height d-flex flex-column px-2 py-4 border-left">
      <FormControl component="fieldset">
        <FormLabel component="legend">Date Range</FormLabel>
        <RadioGroup
          aria-label="Date range"
          name="dateRangeType"
          value={dateRangeType}
          onChange={handleDateRangeChange}
        >
          <FormControlLabel
            value={DateRangeTypes.LAST_WEEK}
            control={<Radio />}
            label="Last Week"
          />
          <FormControlLabel
            value={DateRangeTypes.LAST_MONTH}
            control={<Radio />}
            label="Last Month"
          />
          <FormControlLabel
            value={DateRangeTypes.LAST_YEAR}
            control={<Radio />}
            label="Last Year"
          />
          <FormControlLabel
            value={DateRangeTypes.CUSTOM}
            control={<Radio />}
            label="Custom"
          />
          {dateRangeType === DateRangeTypes.CUSTOM && (
            <Calendar
              placeholderText="Select Dates"
              className="p-2 full-width"
              dateFormat="MMMM d, yyyy"
              shouldCloseOnSelect={false}
              value={`${toMonthDayString(customDateStart)} - ${toMonthDayString(
                customDateEnd,
              )}`}
              onChange={handleDateChange}
              startDate={customDateStart}
              endDate={customDateEnd}
              selectsRange
            />
          )}
        </RadioGroup>
      </FormControl>

      <FormControl className="mt-5">
        <FormLabel component="legend"> Event Status </FormLabel>
        <FormControlLabel
          checked={eventStatus.includes(SETTLE_STATUS.HOLD)}
          onChange={handleSettleStatus}
          control={<Checkbox />}
          label="Hold"
          value={SETTLE_STATUS.HOLD}
        />
        <FormControlLabel
          checked={eventStatus.includes(SETTLE_STATUS.CONFIRMED)}
          onChange={handleSettleStatus}
          control={<Checkbox />}
          label="Confirmed"
          value={SETTLE_STATUS.CONFIRMED}
        />
        <FormControlLabel
          checked={eventStatus.includes(SETTLE_STATUS.IN_SETTLEMENT)}
          onChange={handleSettleStatus}
          control={<Checkbox />}
          label="In Settlement"
          value={SETTLE_STATUS.IN_SETTLEMENT}
        />
        <FormControlLabel
          checked={eventStatus.includes(SETTLE_STATUS.SETTLED)}
          onChange={handleSettleStatus}
          control={<Checkbox />}
          label="Settled"
          value={SETTLE_STATUS.SETTLED}
        />
      </FormControl>
      <div className="d-flex flex-justify-center mt-3">
        <Button onClick={() => onFilterChange(formState)}>Apply filters</Button>
      </div>
    </Wrapper>
  );
}

FilterSidebar.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
};

FilterSidebar.defaultProps = {};

export default memo(FilterSidebar);
