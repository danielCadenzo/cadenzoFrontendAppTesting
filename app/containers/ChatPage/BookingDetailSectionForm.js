import React, { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-form';
import Button from 'components/Button';
import DateTimeField from 'components/Form/DateTimeField';
import Label from 'components/Form/Label';
import InputField from 'components/Form/InputField';
import SelectField from 'components/Form/SelectField';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { graphql, useMutation } from 'react-relay';
import { LINEUP_TYPES } from './constants';

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
  mutation BookingDetailSectionFormMutation(
    $stipulations: [String]
    $guarantee: Int
    $id: ID
    $lineupSlot: String
    $performanceLength: Int
    $revenueSplit: String
    $revenueSplitAmount: Int
    $startDate: DateTime!
    $endDate: DateTime!
    $modifierId: ID!
  ) {
    modifyBookingRequest(
      guarantee: $guarantee
      stipulations: $stipulations
      id: $id
      lineupSlot: $lineupSlot
      performanceLength: $performanceLength
      revenueSplit: $revenueSplit
      revenueSplitAmount: $revenueSplitAmount
      startDate: $startDate
      endDate: $endDate
      modifierId: $modifierId
    ) {
      success
    }
  }
`;

function BookingDetailForm({ bookingDetail, onCancel, activeProfileId }) {
  const { id: bookingDetailId } = bookingDetail;
  const memoizedBookingDetail = useMemo(() => bookingDetail, []);
  const [stipulations, setStipulation] = useState(
    bookingDetail.stipulations || [],
  );

  const AddDateOptionButton = useCallback(({ value, onClick }, ref) => (
    <Button onClick={onClick} ref={ref}>
      Add Date Option
    </Button>
  ));

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
      revenueSplitAmount,
    } = values;
    modifyBookingRequest({
      variables: {
        id: bookingDetailId,
        modifierId: activeProfileId,
        guarantee,
        lineupSlot,
        performanceLength: performanceLength === 0 ? null : performanceLength,
        revenueSplit,
        revenueSplitAmount,
        stipulations: modifiedStipulations.filter(s => !!s && s.length > 0),
      },
    });
  }, [values, isInFlight, activeProfileId]);

  return (
    <Form>
      <div className="d-flex flex-items-center py-1">
        <Label className="mr-2">Guarantee:</Label>
        <InputField type="number" name="guarantee" />
      </div>

      <div className="py-1">
        <Label className="mr-2">Date:</Label>
        <div className="d-flex flex-items-center">
          {bookingDetailId}
          <DateTimeField customInput={<AddDateOptionButton />} />
        </div>
      </div>

      <div className="d-flex flex-items-center py-1">
        <Label className="mr-2">Lineup Slot:</Label>
        <SelectField options={LINEUP_OPTIONS} name="lineupSlot" />
      </div>

      <div className="d-flex flex-items-center flex-wrap py-1">
        <Label className="mr-2 flex-shrink-0">Revenue Split:</Label>
        <div className="d-flex">
          <InputField type="number" name="revenueSplitAmount" />
          <SelectField options={AMOUNT_OPTIONS} name="revenueSplit" />
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
            <InputField className="full-width" name={`stipulations[${idx}]`} />
            <DeleteOutlineIcon
              onClick={() => onDeleteStipulation(idx)}
              className="cursor-pointer"
            />
          </div>
        ))}
      </div>

      <div>
        <Button
          type="button"
          className="full-width f3"
          inverted
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button onClick={onSubmit} type="button" className="full-width f3">
          Save
        </Button>
      </div>
    </Form>
  );
}

BookingDetailForm.defaultProps = {
  bookingDetail: {},
};

export default BookingDetailForm;
