/**
 *
 * Calendar
 *
 */

import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import './index.scss';
import styled from 'styled-components';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

const HeaderText = styled.p`
  color: #6b7897;
  text-align: start;
  padding-left: 8px;
  font-style: normal;
  font-weight: 600;
  font-size: 15px;
  line-height: 18px;

  display: flex;
  align-items: flex-end;
  text-align: center;
  letter-spacing: 0.59375px;
`;

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const NextPrevButton = styled.button`
  background: #f7f8fc;
  width: 25px;
  height: 25px;
  margin: 0px 4px;
  padding: 0px;
  border-radius: 11.2941px;

  & > * {
    color: rgba(140, 150, 171, 1);
  }
`;

const LeftArrow = styled(KeyboardArrowLeftIcon)`
  font-size: 24px;
  text-align: center;
  width: 24px;
  margin: 0 auto;
`;

const RightArrow = styled(KeyboardArrowRightIcon)`
  font-size: 24px;
  text-align: center;
  width: 24px;
  margin: 0 auto;
`;

const Header = ({
  date,
  changeYear,
  changeMonth,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}) => (
  <div className="full-width roboto d-flex flex-justify-between pb-2">
    <HeaderText className="roboto">
      {months[date.getMonth()]} {date.getFullYear()}
    </HeaderText>

    <div>
      <NextPrevButton
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
      >
        <LeftArrow />
      </NextPrevButton>
      <NextPrevButton
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
      >
        <RightArrow />
      </NextPrevButton>
    </div>
  </div>
);

function Calendar(props) {
  const { inline } = props;

  const inlineClassName = inline ? 'cal-inline' : '';

  return (
    <div className={inlineClassName}>
      <DatePicker renderCustomHeader={Header} {...props} />
    </div>
  );
}

Calendar.propTypes = {
  inline: PropTypes.bool,
};

Calendar.defaultProps = {
  inline: false,
};

export default memo(Calendar);
