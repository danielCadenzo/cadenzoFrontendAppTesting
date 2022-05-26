import React, {
  useState,
  useEffect,
  Fragment,
  useCallback,
  useMemo,
} from 'react';
import { FormattedMessage } from 'react-intl';
import DateTimeField from 'components/Form/DateTimeField';
import Checkbox from 'components/Form/Checkbox';
import { DateTime } from 'luxon';
import UIIcon from 'components/UIIcon';
import { IconButton } from '@material-ui/core';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import messages from './messages';
import { OVERRIDE_CALENDAR_FIELD } from './constants';
import DaySelectModal from './Availability/DaySelectModal';

const DayCheckboxWrapper = styled.div`
  width: 88px;
  flex-shrink: 0;
  padding: 0px 8px;
  word-break: keep-all;
}`;

const TimeFieldWrapper = styled.div`
  width: 100px;
`;

const StyledTimeField = styled(DateTimeField)`
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

const NOW = DateTime.now();
const DEFAULT_DATETIME_START = DateTime.local(NOW.year, NOW.month, NOW.day, 12);
const DEFAULT_DATETIME_END = DateTime.local(NOW.year, NOW.month, NOW.day, 23);

const DateSelect = ({
  day,
  formValues,
  setFieldValue,
  getFieldValue,
  showDayToggle,
  onUpdate,
  profileDefaultLocation,
  profileIsArtist,
}) => {
  const defaultState =
    formValues[day].length > 0
      ? formValues[day]
      : [
          {
            startTime: DEFAULT_DATETIME_START,
            endTime: DEFAULT_DATETIME_END,
            location: profileDefaultLocation,
          },
      ];
  const [dayTimeIntervals, setDayTimeIntervals] = useState(defaultState);
  const [showModal, setShowModal] = useState(false);
  const [slotDetailSelected, setSlotDetailSelected] = useState(null);

  const clsName =
    day === 'SUNDAY' || day === OVERRIDE_CALENDAR_FIELD ? '' : 'border-top';
  const checkboxName = `${day}-isEnabled`;
  const checkboxVal = !!formValues[checkboxName];
  const defaultValue = day !== 'SUNDAY';

  useEffect(() => {
    setFieldValue(day, defaultState);
  }, []);

  const addTimeRange = useCallback(slotDetails => {
    const newArr = [
      ...formValues[day],
      {
        startTime: DEFAULT_DATETIME_START,
        endTime: DEFAULT_DATETIME_END,
        location: profileDefaultLocation,
        ...slotDetails,
      },
    ];
    setDayTimeIntervals(newArr);
    setFieldValue(
      day,
      newArr.map(date => ({
        ...date,
        startTime: date.startTime,
        endTime: date.endTime,
      })),
    );
  });

  const toggleModal = useCallback(index => {
    if (index >= 0) setSlotDetailSelected(index);
    if (typeof index !== 'number') setSlotDetailSelected(null);
    setShowModal(!showModal);
  });

  const editTimeSlot = useCallback(timeSlotDetails => {
    const newArr = [...formValues[day]];
    newArr[slotDetailSelected] = {
      ...newArr[slotDetailSelected],
      ...timeSlotDetails,
    };
    setDayTimeIntervals(newArr);
    setFieldValue(day, newArr);
  });

  const deleteTimeRange = useCallback(index => {
    const formCopy = [...formValues[day]];
    formCopy.splice(index, 1);
    const newArr = [...formCopy];
    setDayTimeIntervals(newArr);
    setFieldValue(
      day,
      newArr.map(date => ({
        ...date,
        startTime: date.startTime,
        endTime: date.endTime,
      })),
    );
  });

  const handleToggleCheckbox = useCallback(evt => {
    evt.persist();
    const {
      target: { value, checked },
    } = evt;
    return checked;
  }, []);

  const hookProps = useMemo(
    () => ({
      filterValue: handleToggleCheckbox,
    }),
    [],
  );

  return (
    <div className={`d-flex flex-items-center py-2 ${clsName}`}>
      {showDayToggle && (
        <DayCheckboxWrapper>
          <Checkbox
            defaultValue={defaultValue}
            checked={formValues[checkboxName]}
            onClick={handleToggleCheckbox}
            hookProps={hookProps}
            field={checkboxName}
            className="mr-1"
            type="checkbox"
            label={
              <b>
                <FormattedMessage {...messages[day]} />
              </b>
            }
          />
        </DayCheckboxWrapper>
      )}
      <div className="d-flex flex-column">
        {dayTimeIntervals.map((interval, index) => (
          <div className="d-flex">
            {checkboxVal && (
              <Fragment>
                <TimeFieldWrapper>
                  <StyledTimeField
                    showTimeSelect
                    className="full-width roboto"
                    name={`${day}[${index}].startTime`}
                    showTimeSelectOnly
                    timeIntervals={15}
                    onUpdate={onUpdate}
                    data-id={index}
                    defaultValue={interval.startTime}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                  />
                </TimeFieldWrapper>
                <p className="mx-2 mt-2">-</p>
                <TimeFieldWrapper>
                  <StyledTimeField
                    className="full-width roboto"
                    showTimeSelect
                    name={`${day}[${index}].endTime`}
                    showTimeSelectOnly
                    onUpdate={onUpdate}
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                    defaultValue={interval.endTime}
                  />
                </TimeFieldWrapper>
                {index > 0 && (
                  <IconButton
                    data-dayindex={index}
                    onClick={() => deleteTimeRange(index)}
                    className="mx-2"
                  >
                    <UIIcon name="DeleteOutline" />
                  </IconButton>
                )}
                <IconButton onClick={toggleModal}>
                  <UIIcon name="AddOutline" />{' '}
                </IconButton>
                <IconButton onClick={() => toggleModal(index)}>
                  <UIIcon name="SettingsOutline" />{' '}
                </IconButton>
              </Fragment>
            )}
          </div>
        ))}
        {!checkboxVal && (
          <p className="color-gray d-flex full-width roboto">
            <FormattedMessage {...messages.unavailable} />
          </p>
        )}
        {showModal && (
          <DaySelectModal
            isOpen={showModal}
            onSubmit={
              slotDetailSelected > -1 && formValues[day][slotDetailSelected]
                ? editTimeSlot
                : addTimeRange
            }
            onClose={toggleModal}
            profileDefaultLocation={profileDefaultLocation}
            profileIsArtist={profileIsArtist}
            slotDetail={
              slotDetailSelected > -1 && formValues[day][slotDetailSelected]
            }
          />
        )}
      </div>
    </div>
  );
};

DateSelect.defaultProps = {
  showDayToggle: true,
};

DateSelect.propTypes = {
  day: PropTypes.string.isRequired,
  formValues: PropTypes.object.isRequired,
};

export default DateSelect;
