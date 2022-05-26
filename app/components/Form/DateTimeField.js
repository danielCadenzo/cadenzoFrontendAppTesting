import React, { useCallback, Fragment, useState } from 'react';
import { useField } from 'react-form';
import { DateTime } from 'luxon';
import DatePicker from 'react-datepicker';
import PropTypes from 'prop-types';
import Calendar from 'components/Calendar';
import styled from 'styled-components';
import Button from 'components/Button';

import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

const PortalBackdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  place-content: center;
  place-items: center;
  height: 100%;
  background-color: rgb(0 0 0 / 70%);
  z-index: 10;

  & .inline-wrapper {
    margin: auto;
    display: flex;
    place-content: center;
    flex-direction: column;
    place-items: center;
  }
`;

const CalendarWrapper = styled.div`
  background-color: #ffffff;
  width: fit-content;
  border-radius: 8px;
`;

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

export default function DateTimeField(props) {
  const [showPortal, setShowPortal] = useState(false);

  const {
    name = 'date',
    selected = DateTime.now(),
    usePortal,
    portalIsMultiSelect,
    CustomInput,
    calendarContainer,
    onPortalChange,
    defaultValue,
    showSaveButton = true,
    onSaveButtonClick,
    onUpdate,
    onClose,
    ...rest
  } = props;
  const {
    meta: { error, isTouched, isValidating },
    value,
    setValue,
  } = useField(name, {
    defaultValue: defaultValue || selected,
  });

  const handleChange = useCallback(date => {
    setValue(DateTime.fromJSDate(new Date(date)));
    if (onUpdate)
      onUpdate({ name, value: DateTime.fromJSDate(new Date(date)) });
  }, []);

  const handleTogglePortal = () => {
    if (showPortal && onClose) onClose();
    setShowPortal(!showPortal);
  };

  const onSave = () => {
    setShowPortal(!showPortal);
    onSaveButtonClick();
  };

  // rendering bug that I don't feel like fixing, so leave here
  true && true;

  return (
    <Fragment>
      {!CustomInput && (
        <DatePicker
          value={value.toJSDate()}
          selected={value.toJSDate()}
          onChange={handleChange}
          renderCustomHeader={Header}
          {...rest}
        />
      )}
      {CustomInput && <CustomInput onTogglePortal={handleTogglePortal} />}
      {CustomInput && usePortal && showPortal && (
        <PortalBackdrop>
          <CalendarWrapper className="inline-wrapper">
            <Calendar
              shouldCloseOnSelect={!portalIsMultiSelect}
              onChange={onPortalChange}
              inline
              calendarContainer={calendarContainer}
              {...rest}
            />
            {showSaveButton && (
              <span>
                <Button onClick={handleTogglePortal} inverted>
                  Cancel
                </Button>
                <Button onClick={onSave}>Save</Button>
              </span>
            )}
          </CalendarWrapper>
        </PortalBackdrop>
      )}
    </Fragment>
  );
}

DateTimeField.propTypes = {
  name: PropTypes.string,
};
