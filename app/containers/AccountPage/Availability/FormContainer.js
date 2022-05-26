import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-form';
import Button from 'components/Button';
import { ISO_TIME_FORMAT } from 'utils/dates';
import { pick } from 'lodash';
import { DateTime } from 'luxon';
import { FormattedMessage } from 'react-intl';
// import messages from './../messages';
import { getIsActiveProfileAnArtist } from 'data/selectors/authSelectors';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createNotification as CreateNotificationAction } from 'components/NotificationProvider/actions';
import { trackEvent } from 'utils/analytics';
import DateSelect from '../DaySelect';
import OverrideContainer from './OverrideContainer';
import { DAYS_OF_WEEK, OVERRIDE_CALENDAR_FIELD, DayEnum } from '../constants';
import { mapCalendarToAvailabilityDefaults } from './utils';
import messages from '../messages';
import OverrideListContainer from './OverrideListContainer';

const SLOT_PROPS = ['isNegotiable', 'dayOfWeek', 'guarantee', 'doorSplit'];

function FormContainer({
  createNotification,
  profileDefaults,
  onSubmitDateOverride,
  modalDaySelection,
  onSubmitSchedule,
  setModalCalendarDates,
  existingOverrides,
  profileDefaultLocation,
  profileIsArtist,
}) {
  const defaultValues = useMemo(
    () => ({
      ...mapCalendarToAvailabilityDefaults(
        profileDefaults,
        profileDefaultLocation,
      ),
    }),
    [],
  );

  const [selectedDateOverrides, setSelectedDateOverrides] = useState(
    defaultValues[OVERRIDE_CALENDAR_FIELD],
  );
  const {
    Form,
    setFieldValue,
    values,
    meta: { error, submissionAttempts },
  } = useForm({
    defaultValues,
    debugForm: false,
  });

  // for modal date selection in overrides
  const handleDateSelect = useCallback(
    dateObj => {
      const index = modalDaySelection.findIndex(
        d =>
          d.month === dateObj.getMonth() &&
          d.day === dateObj.getDay() &&
          d.month === dateObj.getMonth() &&
          d.day === dateObj.getDay(),
      );
      if (index === -1) {
        const timeRanges = (values[OVERRIDE_CALENDAR_FIELD] || []).map(
          range => ({
            startTime: DateTime.local(
              dateObj.getFullYear(),
              dateObj.getMonth() + 1,
              dateObj.getDate(),
              range.startTime.hour,
              range.startTime.minute,
            ),

            endTime: DateTime.local(
              dateObj.getFullYear(),
              dateObj.getMonth() + 1,
              dateObj.getDate(),
              range.endTime.hour,
              range.endTime.minute,
            ),
          }),
        );
        setModalCalendarDates([...modalDaySelection, dateObj]);
        setSelectedDateOverrides([...selectedDateOverrides, ...timeRanges]);
      } else {
        const newArr = [...modalDaySelection];
        newArr.splice(index, 1);
        setModalCalendarDates(newArr);

        const newOverrides = [...selectedDateOverrides];
        const amtDatesToRemove = selectedDateOverrides.filter(
          d =>
            d.month === dateObj.month &&
            d.day === dateObj.day &&
            d.month === dateObj.month &&
            d.day === dateObj.day,
        ).length;
        newOverrides.splice(index, amtDatesToRemove);
        setSelectedDateOverrides(newOverrides);
      }
    },
    [
      modalDaySelection,
      setModalCalendarDates,
      values,
      setSelectedDateOverrides,
      selectedDateOverrides,
    ],
  );

  const onDeleteOverrides = listOfIndexs => {
    setSelectedDateOverrides(
      selectedDateOverrides.filter(
        (override, index) => !listOfIndexs.some(v => v === index),
      ),
    );
  };

  // change to useeffect on as a validation helper
  const onSubmitBookingSchedule = useCallback(() => {
    let weeklyScheduleArr = [];
    const weeklyHours = pick(values, DAYS_OF_WEEK);
    Object.keys(weeklyHours).forEach(dayOfWeek => {
      if (values[`${dayOfWeek}-isEnabled`]) {
        const valuesWithDay = weeklyHours[dayOfWeek].map(timeRange => ({
          ...timeRange,
          dayOfWeek: DayEnum[dayOfWeek],
        }));
        weeklyScheduleArr = [...weeklyScheduleArr, ...valuesWithDay];
      }
    });
    onSubmitSchedule({
      variables: {
        profileId: localStorage.getItem('activeProfileId'),
        scheduleOverrides: selectedDateOverrides.map(
          ({ startTime, endTime, location, ...rest }) => ({
            ...rest,
            startTime: startTime.toUTC(),
            endTime: endTime.toUTC(),
          }),
        ),
        weeklyAvailability: weeklyScheduleArr.map(daySchedule => ({
          ...(profileIsArtist ? daySchedule : pick(daySchedule, SLOT_PROPS)),
          startTime: daySchedule.startTime.toUTC().toFormat(ISO_TIME_FORMAT),
          endTime: daySchedule.endTime.toUTC().toFormat(ISO_TIME_FORMAT),
        })),
      },
      onCompleted: () => {
        createNotification(
          <FormattedMessage {...messages.scheduleSavedMsg} />,
          <FormattedMessage {...messages.scheduleSaved} />,
          5000,
        );
        trackEvent('set_schedule');
      },
    });
  }, [values, selectedDateOverrides]);

  const commitOverrides = useCallback(overrides => {
    setSelectedDateOverrides([...selectedDateOverrides, ...overrides]);
    setFieldValue(OVERRIDE_CALENDAR_FIELD, [
      ...selectedDateOverrides,
      ...overrides,
    ]);
    // cleanup function
    onSubmitDateOverride();
  });

  return (
    <Form className="mx-auto">
      <div className="d-flex border">
        <div className="d-flex flex-column p-2 border-right">
          <b className="f3 color-primary">Set your weekly hours</b>
          {DAYS_OF_WEEK.map(day => (
            <DateSelect
              setFieldValue={setFieldValue}
              formValues={values}
              day={day}
              profileIsArtist={profileIsArtist}
              profileDefaultLocation={profileDefaultLocation}
            />
          ))}
        </div>
        <div className="d-flex p-2 flex-column">
          <b className="f3 roboto color-primary">
            <FormattedMessage {...messages.dateOverrideHeader} />
          </b>
          <p className="roboto f5 pt-2">
            {' '}
            <FormattedMessage {...messages.dateOverrideText} />{' '}
          </p>

          <OverrideContainer
            setFieldValue={setFieldValue}
            formValues={values}
            onSubmitDateOverrides={setSelectedDateOverrides}
            selectedDateOverrides={selectedDateOverrides}
            commitOverrides={commitOverrides}
            handleDateSelect={handleDateSelect}
            modalDaySelection={modalDaySelection}
            profileIsArtist={profileIsArtist}
            profileDefaultLocation={profileDefaultLocation}
          />

          <OverrideListContainer
            onDeleteOverrides={onDeleteOverrides}
            overrides={selectedDateOverrides}
          />
        </div>
      </div>
      <Button className="px-3" inverted>
        Cancel
      </Button>
      <Button onClick={onSubmitBookingSchedule} className="px-4">
        Save
      </Button>
    </Form>
  );
}

FormContainer.propTypes = {
  createNotification: PropTypes.func.isRequired,
  profileDefaults: PropTypes.object,
  onSubmitSchedule: PropTypes.func.isRequired,
  onModalTimeRangeChange: PropTypes.func,
  onSubmitDateOverride: PropTypes.func,
  setSelectedDateOverrides: PropTypes.func,
  setModalCalendarDates: PropTypes.func,
  modalDaySelection: PropTypes.array,
  profileIsArtist: PropTypes.bool.isRequired,
  selectedDateOverrides: PropTypes.array,
};

const mapDispatchToProps = {
  createNotification: CreateNotificationAction,
};

const stateToProps = state => ({
  profileIsArtist: getIsActiveProfileAnArtist(state),
});

const withConnect = connect(
  stateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(FormContainer);
