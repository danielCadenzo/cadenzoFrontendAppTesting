import React, { useMemo, useCallback, useState } from 'react';
import Input from 'components/Form/InputField';
import Checkbox from 'components/Form/Checkbox';
import Label from 'components/Form/Label';
import { useForm } from 'react-form';
import Button from 'components/Button';
import LocationSelect from 'components/AsyncSelect/LocationSelect';
import {
  Checkbox as MuiCheckbox,
  FormControlLabel,
  IconButton,
} from '@material-ui/core';
import Calendar from 'components/Calendar/MonthCalendar';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import 'components/Calendar/datepicker.scss';
import TextField from '@material-ui/core/TextField';
import { DateTime } from 'luxon';

const LUXON_DATE_FORMAT = 'y-LL-dd';

function OverrideModalForm({
  onSubmit,
  onClose,
  profileDefaultLocation,
  profileIsArtist,
}) {
  const [useDefaultLocation, setUseDefaultLocation] = useState(true);
  const [overrideTimeRanges, setTimeRanges] = useState([]);

  const defaultValues = useMemo(
    () => ({
      guarantee: 0,
      doorSplit: 25,
      isNegotiable: true,
      location: profileDefaultLocation,
      isDisabled: false,
    }),
    [],
  );
  const { Form, values, setFieldValue, reset } = useForm({
    defaultValues,
    onSubmit,
  });

  const validateFormValues = () => {
    const {
      calendarDates,
      isNegotiable,
      doorSplit,
      guarantee,
      isDisabled,
    } = values;
    const finalSubmissions = [];
    const location = useDefaultLocation
      ? profileDefaultLocation
      : values.location;
    calendarDates.forEach(day => {
      if (!isDisabled) {
        overrideTimeRanges.forEach(tR => {
          const { startTime, endTime } = tR;
          finalSubmissions.push({
            location,
            isNegotiable,
            doorSplit,
            isDisabled,
            guarantee,
            startTime: DateTime.fromSQL(
              `${day.toFormat(LUXON_DATE_FORMAT)} ${startTime}:00`,
            ),
            endTime: DateTime.fromSQL(
              `${day.toFormat(LUXON_DATE_FORMAT)} ${endTime}:00`,
            ),
            day: day.toFormat(LUXON_DATE_FORMAT),
          });
        });
      } else {
        // push a disabled override on the stack
        finalSubmissions.push({
          location,
          isNegotiable,
          doorSplit,
          isDisabled,
          guarantee,
          startTime: DateTime.fromSQL(
            `${day.toFormat(LUXON_DATE_FORMAT)} 12:00:00`,
          ),
          endTime: DateTime.fromSQL(
            `${day.toFormat(LUXON_DATE_FORMAT)} 12:00:00`,
          ),
          day: day.toFormat(LUXON_DATE_FORMAT),
        });
      }
    });
    return finalSubmissions;
  };

  const handleFormSubmit = useCallback(() => {
    const newTimeRanges = validateFormValues();
    onSubmit(newTimeRanges);
    reset();
  }, [values, useDefaultLocation, overrideTimeRanges]);

  const onChangeLocation = addressNode => {
    setFieldValue('location', addressNode);
  };

  const addTimeRange = () => {
    setTimeRanges([
      ...overrideTimeRanges,
      {
        location: profileDefaultLocation,
        startTime: '18:30',
        endTime: '21:30',
      },
    ]);
  };

  const onDeleteTimeRange = index => {
    overrideTimeRanges.splice(index, 1);
    setTimeRanges([...overrideTimeRanges]);
  };

  const handleTimeRangeChange = (valueName, index, value) => {
    const newRanges = [...overrideTimeRanges];
    newRanges[index][valueName] = value;
    setTimeRanges(newRanges);
  };

  const onDateChange = dateArr => {
    setFieldValue(
      'calendarDates',
      dateArr.map(momentDt => DateTime.fromJSDate(momentDt.toDate())),
    );
  };

  return (
    <div className="d-flex flex-column p-3 height-fit-content flex-items-center">
      <Form>
        <Checkbox
          className="my-2"
          field="isDisabled"
          checked={values.isDisabled}
          value={values.isDisabled}
          defaultValue={false}
          label="Is this day un-available for bookings"
        />
        <Calendar
          isMulti
          onUpdate={onDateChange}
          className="full-height m-3 visibility-visible"
          hidden={false}
        />
        <Button
          disabled={values.isDisabled}
          onClick={addTimeRange}
          className="mt-2"
        >
          {' '}
          Add Time Slot{' '}
        </Button>
        {overrideTimeRanges.map((dt, index) => (
          <div className="d-flex my-2 flex-justify-around flex-items-center full-width">
            <TextField
              type="time"
              onChange={evnt =>
                handleTimeRangeChange('startTime', index, evnt.target.value)
              }
              defaultValue={dt.startTime}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300, // 5 min
              }}
            />

            <p>to</p>

            <TextField
              type="time"
              onChange={evnt =>
                handleTimeRangeChange('endTime', index, evnt.target.value)
              }
              defaultValue={dt.endTime}
              InputLabelProps={{
                shrink: true,
                disabled: values.isDisabled,
              }}
              inputProps={{
                step: 300, // 5 min
              }}
            />

            <IconButton
              onClick={() => onDeleteTimeRange(index)}
              className="mx-2"
            >
              <DeleteOutlineIcon />
            </IconButton>
          </div>
        ))}
        <div className="d-flex flex-wrap flex-items-center">
          <Label> Artist Guarantee: </Label>
          <div className="d-flex flex-items-center">
            <p>$</p>
            <Input
              className="my-2 ml-1 full-width"
              name="guarantee"
              type="number"
              defaultValue="0"
              disabled={values.isDisabled}
              placeholder="$300"
            />
          </div>
        </div>
        <div className="d-flex flex-wrap flex-items-center">
          <Label> Artist Door Split: </Label>
          <span className="d-flex flex-items-center">
            <Input
              className="my-2 mr-2 full-width"
              name="doorSplit"
              placeholder="Door split %"
              defaultValue="0"
              type="number"
              disabled={values.isDisabled}
              max={100}
              min={0}
            />
            <p>%</p>

            <div className="d-flex full-width ml-4 flex-shrink-0">
              <p className="pr-2">Venue Split: </p>
              <p> {100 - values.doorSplit || 0}%</p>
            </div>
          </span>
        </div>
        <Checkbox
          className="my-2"
          field="isNegotiable"
          checked={values.isNegotiable}
          value={values.isNegotiable}
          label="Is This Slot Negotiable? (Negotiable offers receive more requests)"
        />

        {profileIsArtist && (
          <div className="d-flex flex-column my-2">
            <FormControlLabel
              control={
                <MuiCheckbox
                  checked={!useDefaultLocation}
                  onChange={() => setUseDefaultLocation(!useDefaultLocation)}
                  value={!useDefaultLocation}
                />
              }
              label="Location (Are you going to be in a different city)"
            />
            {!useDefaultLocation && (
              <LocationSelect showCitiesAndPlaces onChange={onChangeLocation} />
            )}
          </div>
        )}
      </Form>

      <div className="d-flex flex-justify-center">
        <Button className="px-5 py-3" onClick={handleFormSubmit}>
          Add
        </Button>
        <Button type="button" inverted className="px-5 py-3" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}

export default OverrideModalForm;
