import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-form';
import Button from 'components/Button';
import Label from 'components/Form/Label';
import InputField from 'components/Form/InputField';
import SelectField from 'components/Form/SelectField';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { graphql, useMutation } from 'react-relay';
import Modal from 'components/Modal';
import { LINEUP_TYPES } from 'containers/ChatPage/constants';
import ProfileTypes from 'constants/ProfileTypes';
import TextField from 'components/Form/TextField';
import { trackEvent } from 'utils/analytics';

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

const SEND_BOOKING_REQUEST = graphql`
  mutation SendBookingRequestModalMutation(
    $artistId: ID!
    $hostId: ID!
    $message: String!
    $slotId: ID!
    $startDate: DateTime!
    $initiator: BookingInitiatorEnum!
    $guarantee: Int
    $endDate: DateTime!
    $revenueSplitAmount: Int
    $revenueSplit: String
    $stipulations: [String]
  ) {
    sendBookingRequest(
      artistId: $artistId
      hostId: $hostId
      startDate: $startDate
      slotId: $slotId
      endDate: $endDate
      guarantee: $guarantee
      initiator: $initiator
      doorSplit: $revenueSplitAmount
      revenueSplit: $revenueSplit
      revenueSplitAmount: $revenueSplitAmount
      stipulations: $stipulations
      message: $message
    ) {
      success
    }
  }
`;

function SendBookingRequestModal({
  slot,
  onCancel,
  onSaveSuccess,
  requesteeId,
  isRequesterAnVenue,
  requesterId,
  showConfirmedBooking,
}) {
  const memoizedBookingDetail = useMemo(
    () => ({
      message: '',
      revenueSplitAmount: slot.doorSplit,
      revenueSplit: AMOUNT_OPTIONS[1].value,
      stipulations: [],
      ...slot,
    }),
    [],
  );

  const [stipulations, setStipulation] = useState(slot.stipulations || []);

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

  const [sendBookingRequest, isInFlight] = useMutation(SEND_BOOKING_REQUEST);

  const { Form, setFieldValue, values } = useForm({
    defaultValues: memoizedBookingDetail,
  });

  const onSubmit = useCallback(() => {
    const {
      guarantee,
      stipulations: modifiedStipulations,
      lineupSlot,
      performanceLength,
      revenueSplit,
      message,
      revenueSplitAmount,
    } = values;

    const { startDate, endDate, slotId } = slot;
    const strStartDate =
      typeof startDate === 'string' ? startDate : startDate.toUTC().toISO();
    const strEndDate =
      typeof endDate === 'string' ? endDate : endDate.toUTC().toISO();

    sendBookingRequest({
      variables: {
        guarantee,
        lineupSlot,
        slotId,
        message,
        hostId: isRequesterAnVenue ? requesterId : requesteeId,
        artistId: isRequesterAnVenue ? requesteeId : requesterId,
        startDate: strStartDate,
        endDate: strEndDate,
        performanceLength: performanceLength === 0 ? null : performanceLength,
        revenueSplit,
        initiator: isRequesterAnVenue
          ? ProfileTypes.VENUE
          : ProfileTypes.ARTIST,
        revenueSplitAmount,
        stipulations: modifiedStipulations.filter(s => !!s && s.length > 0),
      },
      onCompleted: response => {
        if (
          response &&
          response.sendBookingRequest &&
          response.sendBookingRequest.success
        ) {
          onCancel();
          showConfirmedBooking();
          trackEvent('sent_booking_request', {
            artistId: isRequesterAnVenue ? requesteeId : requesterId,
            hostId: isRequesterAnVenue ? requesterId : requesteeId,
          });
        }

        if (onSaveSuccess) onSaveSuccess();
      },
    });
  }, [values, isInFlight]);

  const isReadOnly = !slot.isNegotiable;

  return (
    <Modal onClose={onCancel} isOpen header="Send Booking Request">
      <Form>
        <div className="d-flex flex-wrap flex-items-center py-1">
          <Label className="mr-2">Guarantee:</Label>
          <InputField disabled={isReadOnly} type="number" name="guarantee" />
        </div>

        <div className="d-flex flex-wrap flex-items-center py-1">
          <Label className="mr-2">Lineup Slot:</Label>
          <SelectField
            disabled={isReadOnly}
            options={LINEUP_OPTIONS}
            name="lineupSlot"
          />
        </div>

        <div className="d-flex flex-items-center flex-wrap py-1">
          <Label className="mr-2 flex-shrink-0">Revenue Split:</Label>
          <div className="d-flex flex-items-center">
            <InputField
              disabled={isReadOnly}
              type="number"
              min="0"
              max="100"
              name="revenueSplitAmount"
            />
            <p className='f3 text-bold'>%</p>
          </div>
        </div>

        <div className="d-flex flex-column py-1">
          <div className="d-flex flex-items-center">
            <Label className="mr-2 flex-shrink-0">Stipulations:</Label>
            <Button type="button" onClick={onAddStipulation}>
              Add Stipulation
            </Button>
          </div>
          {stipulations.map((stipulation, idx) => (
            <div className="d-flex flex-items-center my-1">
              <InputField
                className="full-width"
                name={`stipulations[${idx}]`}
              />
              <DeleteOutlineIcon
                onClick={() => onDeleteStipulation(idx)}
                className="cursor-pointer"
              />
            </div>
          ))}
        </div>

        <TextField
          placeholder="Leave a message. Tell them why you want to book!"
          className="full-width"
          name="message"
          required
        />

        <Button type="button" onClick={onSubmit} className="full-width f3">
          Send
        </Button>
      </Form>
    </Modal>
  );
}

SendBookingRequestModal.defaultProps = {};

SendBookingRequestModal.propTypes = {
  onCancel: PropTypes.func,
  slot: PropTypes.object,
  onSaveSuccess: PropTypes.func,
  requesteeId: PropTypes.string.isRequired,
  isRequesterAnVenue: PropTypes.bool.isRequired,
  requesterId: PropTypes.string.isRequired,
};

export default SendBookingRequestModal;
