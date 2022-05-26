import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-form';
import Button from 'components/Button';
import Label from 'components/Form/Label';
import { cadenzoPrimary } from 'utils/CssVariables';
import InputField from 'components/Form/InputField';
import SelectField from 'components/Form/SelectField';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { graphql, useMutation } from 'react-relay';
import BookingCalendar from 'components/Calendar/BookingCalendar';
import { LINEUP_TYPES } from 'containers/ChatPage/constants';
import { DateTime } from 'luxon';
import styled from 'styled-components';
import { trackEvent } from 'utils/analytics';
import BookingRequestActions from 'constants/BookingRequestActions';
import LoadingSpinner from 'components/LoadingSpinner/Loadable';
import { deviceMax } from '../../constants/ResponsiveSizing/deviceSize';

const LINEUP_OPTIONS = Object.keys(LINEUP_TYPES).map(optionKey => ({
  label: LINEUP_TYPES[optionKey],
  value: optionKey,
}));

const AMOUNT_OPTIONS = Object.freeze([
  {
    label: '$',
    value: 'AMOUNT',
  },
  {
    label: '%',
    value: 'PERCENTAGE',
  },
]);

const MODIFY_BOOKING = graphql`
  mutation BookingEditFormMutation(
    $stipulations: [String]
    $guarantee: Int
    $id: ID
    $lineupSlot: String
    $performanceLength: Int
    $endDate: DateTime!
    $startDate: DateTime!
    $revenueSplit: String
    $revenueSplitAmount: Int
    $modifierId: ID!
  ) {
    modifyBookingRequest(
      guarantee: $guarantee
      stipulations: $stipulations
      id: $id
      modifierId: $modifierId
      startDate: $startDate
      endDate: $endDate
      lineupSlot: $lineupSlot
      performanceLength: $performanceLength
      revenueSplit: $revenueSplit
      revenueSplitAmount: $revenueSplitAmount
    ) {
      success
      buffer {
        performanceLength
        revenueSplit
        revenueSplitAmount
        id
        startDate
        endDate
        stipulations
        guarantee
        lastUpdatedBy {
          id
        }
      }
    }
  }
`;

const ACCEPT_BOOKING = graphql`
  mutation BookingEditFormAcceptMutation($id: ID) {
    acceptBookingRequest(id: $id) {
      success
    }
  }
`;

const DECLINE_BOOKING = graphql`
  mutation BookingEditFormDeclineBookingMutation($id: ID) {
    declineBookingRequest(id: $id) {
      success
    }
  }
`;

const CANCEL_BOOKING = graphql`
  mutation BookingEditFormCancelBookingMutation($by: ID!, $id: ID) {
    CancelBooking(by: $by, id: $id) {
      success
    }
  }
`;

const DetailHeader = styled.h4`
  font-size: xx-large;
  text-align: center;
  font-weight: 500;
  margin: 11px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  button {
    padding: 15px;
    border-color: #ffffff00;
    background-color: #f4f0ef;
    border-radius: 5px;
    color: #515151;
    &:hover {
      transition: 1s;
      background-color: ${cadenzoPrimary};
      color: white;
    }
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-gap: 1em;
  align-items: center;
  margin-bottom: 5px;

  div: nth-of-type(3) {
    background-color: #ffff;
  }

  label {
    font-weight: 700;
    text-align: right;
    @media ${deviceMax.tablet} {
      text-align: left;
    }
  }

  button {
    border-radius: 5px;
  }

  @media ${deviceMax.tablet} {
    grid-template-columns: 1fr;
  }
`;
const StipulationGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 1em;
  grid-column: 1/3;

  @media ${deviceMax.tablet} {
    grid-column: 1;
  }
`;

function BookingEditForm({
  bookingDetail,
  availableActions,
  onClose,
  activeProfile,
  onSaveSuccess,
  venueId,
  readOnly,
  isCancelled,
  updateBooking,
}) {
  const { id: bookingDetailId } = bookingDetail;
  const memoizedBookingDetail = useMemo(() => bookingDetail, []);

  const [stipulations, setStipulation] = useState(
    bookingDetail.stipulations || [],
  );

  const onDeleteStipulation = index => {
    setFieldValue(`stipulations${[index]}`, null);
    const newStipulations = [...stipulations];
    newStipulations.splice(index, 1);
    setStipulation(newStipulations);
  };

  const onAddStipulation = () => {
    const newArr = [...stipulations, ''];
    setStipulation(newArr);
  };

  const [modifyBookingRequest, isInFlight] = useMutation(MODIFY_BOOKING);
  const [declineBookingRequest, dInFlight] = useMutation(DECLINE_BOOKING);
  const [acceptBookingRequest, aInFlight] = useMutation(ACCEPT_BOOKING);
  const [cancelBooking, cInFlight] = useMutation(CANCEL_BOOKING);

  const { Form, setFieldValue, values } = useForm({
    defaultValues: memoizedBookingDetail,
  });

  const handleCompletedRequest = useCallback(() => {
    onClose();
  }, [onClose]);

  const onAccept = useCallback(() => {
    acceptBookingRequest({
      variables: {
        id: bookingDetailId,
      },
      onCompleted: response => {
        trackEvent('accept_booking');
        if (response.acceptBookingRequest.success) {
          updateBooking(bookingDetail, BookingRequestActions.ACCEPT);
          if (onSaveSuccess) onSaveSuccess();
        }
      },
    });
  });

  const onDecline = useCallback(() => {
    declineBookingRequest({
      variables: {
        id: bookingDetailId,
      },
      onCompleted: response => {
        trackEvent('decline_booking');
        if (response.declineBookingRequest.success) {
          updateBooking(bookingDetail, BookingRequestActions.DECLINE);
          handleCompletedRequest();
        }
      },
    });
  });

  const onCancel = useCallback(() => {
    cancelBooking({
      variables: {
        by: activeProfile.rId,
        id: bookingDetailId,
      },
      onCompleted: response => {
        trackEvent('cancel_booking');
        if (response.CancelBooking.success) {
          updateBooking(bookingDetail, BookingRequestActions.CANCEL);
          handleCompletedRequest();
        }
      },
    });
  });

  const onSubmit = useCallback(() => {
    const {
      guarantee,
      stipulations: modifiedStipulations,
      lineupSlot,
      performanceLength,
      revenueSplit,
      revenueSplitAmount,
      endDate,
      startDate,
    } = values;

    const strStartDate =
      typeof startDate === 'string' ? startDate : startDate.toUTC().toISO();
    const strEndDate =
      typeof endDate === 'string' ? endDate : endDate.toUTC().toISO();

    modifyBookingRequest({
      variables: {
        id: bookingDetailId,
        modifierId: activeProfile.id,
        guarantee,
        lineupSlot,
        startDate: strStartDate,
        endDate: strEndDate,
        performanceLength: performanceLength === 0 ? null : performanceLength,
        revenueSplit,
        revenueSplitAmount,
        stipulations: modifiedStipulations.filter(s => !!s && s.length > 0),
      },
      onCompleted: response => {
        if (response.modifyBookingRequest.success) {
          updateBooking(
            response.modifyBookingRequest.buffer,
            BookingRequestActions.MODIFY,
          );
          if (onSaveSuccess) onSaveSuccess();
          else handleCompletedRequest();
        }
      },
    });
  }, [values, isInFlight, activeProfile.id, updateBooking]);

  const onSlotSelected = ({ startDate, endDate }) => {
    setFieldValue('startDate', startDate);
    setFieldValue('endDate', endDate);
  };

  const momentBookingStart = useMemo(() => DateTime.fromISO(bookingDetail.startDate).toFormat('HH:mm:ss'), [
    bookingDetail,
  ]);

  const bookingStartDate = useMemo(
    () => DateTime.fromISO(bookingDetail.startDate).toFormat('HH:mm:ss'),
    [bookingDetail.endDate],
  );
  const bookingEndDate = useMemo(
    () => DateTime.fromISO(bookingDetail.endDate).toFormat('HH:mm:ss'),
    [bookingDetail.startDate],
  );

  if (isInFlight || dInFlight || aInFlight || cInFlight)
    return <LoadingSpinner />;

  return (
    <Form>
      <DetailHeader>Booking Details</DetailHeader>
      <FormGrid>
        <Label>Date</Label>
        <div className="d-flex flex-column flex-justify-center bg-white">
          <BookingCalendar
            disabled={readOnly}
            initialDate={momentBookingStart}
            defaultSlotStart={bookingStartDate}
            defaultSlotEnd={bookingEndDate}
            onSlotSelected={onSlotSelected}
            useDatePicker
            creatorId={venueId}
          />
        </div>

        <Label>Lineup Slot</Label>
        <SelectField
          disabled={readOnly}
          options={LINEUP_OPTIONS}
          name="lineupSlot"
        />

        <Label>Guarantee</Label>
        <InputField disabled={readOnly} type="number" name="guarantee" />

        <Label>Revenue Split</Label>
        <div className="d-flex">
          <InputField
            disabled={readOnly}
            type="number"
            name="revenueSplitAmount"
          />
          <SelectField
            disabled={readOnly}
            options={AMOUNT_OPTIONS}
            name="revenueSplit"
          />
        </div>

        <Label>Stipulations</Label>
        <div className="d-flex flex-items-center">
          <Button disabled={readOnly} type="button" onClick={onAddStipulation}>
            Add Stipulation
          </Button>
        </div>
        {stipulations.map((stipulation, idx) => (
          <StipulationGrid>
            <div className="d-flex flex-items-center my-1">
              <InputField
                disabled={readOnly}
                className="full-width"
                name={`stipulations[${idx}]`}
              />
              {!readOnly && (
                <DeleteOutlineIcon
                  disabled={readOnly}
                  onClick={() => onDeleteStipulation(idx)}
                  className="cursor-pointer"
                />
              )}
            </div>
          </StipulationGrid>
        ))}
      </FormGrid>

      {availableActions.includes(BookingRequestActions.CANCEL) && (
        <ButtonContainer>
          <Button
            onClick={onCancel}
            inverted
            type="button"
            className="full-width f3"
          >
            Cancel Show
          </Button>
        </ButtonContainer>
      )}

      <ButtonContainer>
        {availableActions.includes(BookingRequestActions.MODIFY) && (
          <Button
            onClick={onSubmit}
            inverted
            type="button"
            className="full-width f3 mx-2"
          >
            Modify
          </Button>
        )}

        {availableActions.includes(BookingRequestActions.ACCEPT) && (
          <Button
            onClick={onAccept}
            inverted
            type="button"
            className="full-width f3 mx-2"
          >
            Accept
          </Button>
        )}

        {availableActions.includes(BookingRequestActions.DECLINE) && (
          <Button
            onClick={onDecline}
            inverted
            type="button"
            className="full-width f3"
          >
            Decline
          </Button>
        )}
      </ButtonContainer>
    </Form>
  );
}

BookingEditForm.defaultProps = {
  bookingDetail: {},
};

BookingEditForm.propTypes = {
  availableActions: PropTypes.arrayOf(Object.values(BookingRequestActions)),
  bookingDetail: PropTypes.object,
  onSaveSuccess: PropTypes.func,
  updateBooking: PropTypes.func,
  venueId: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
  isCancelled: PropTypes.bool.isRequired,
  activeProfile: PropTypes.object.isRequired,
};

export default BookingEditForm;
