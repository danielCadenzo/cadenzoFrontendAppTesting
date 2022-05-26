import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import CreateableSelect from 'components/AsyncSelect/Createable';
import { createGQLQuery } from 'data/api';
import { useForm } from 'react-form';
import { createUUID } from 'utils/helpers';
import InputField from 'components/Form/InputField';
import SelectField from 'components/Form/SelectField';
import DateTimeField from 'components/Form/DateTimeField';
import Label from 'components/Form/Label';
import { LINEUP_TYPES } from 'containers/ChatPage/constants';
import { graphql, useMutation } from 'react-relay';
import Button from 'components/Button';

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

const INVITATION_MUTATION = graphql`
  mutation BookingInvitationRowMutation(
    $stipulations: [String]
    $guarantee: Int
    $id: ID
    $lineupSlot: String!
    $toEmail: String!
    $endDate: DateTime!
    $startDate: DateTime!
    $revenueSplit: String
    $revenueSplitAmount: Int
    $profileId: ID!
    $receiverId: ID!
  ) {
    sendBookingInvitations(
      initiator: VENUE
      guarantee: $guarantee
      toEmail: $toEmail
      profileId: $profileId
      receiverId: $receiverId
      stipulations: $stipulations
      id: $id
      startDate: $startDate
      endDate: $endDate
      lineupSlot: $lineupSlot
      revenueSplit: $revenueSplit
      revenueSplitAmount: $revenueSplitAmount
    ) {
      success
    }
  }
`;

const USER_SEARCH_QUERY = `
query($name: String){
  artists(nameContains: $name) {
    edges {
      node{
        id
        name
        avatar
      }
    }
  }
}`;

function BookingInvitationRow({ bookingInvitation }) {
  const defaultValues = useMemo(() => bookingInvitation, []);
  const [isExpanded, setIsExpanded] = useState(false);
  const { Form, setFieldValue, values } = useForm({ defaultValues });

  const onLoadOptions = e =>
    createGQLQuery(USER_SEARCH_QUERY, { email: e }).then(data => {
      const values = data.users.edges.map(node => ({
        label: node.node.name,
        value: node.node.id,
      }));
      return values;
    });

  const onSelectArtistProfile = userOption => {
    if (userOption) {
      setFieldValue('to_email', userOption.value);
      setFieldValue('receiver_id', userOption.value);
    }
  };

  const onToggleVisibility = () => setIsExpanded(!isExpanded);

  const [createModifyBookingInvitation, isInFlight] = useMutation(
    INVITATION_MUTATION,
  );

  const onSave = () => {
    createModifyBookingInvitation({
      variables: {
        guarantee: values.guarantee,
        toEmail: values.toEmail,
        profileId: values.profileId,
        receiverId: values.receiverId,
        stipulations: values.stipulations,
        id: values.id,
        startDate: values.startDate,
        endDate: values.endDate,
        lineupSlot: values.lineupSlot,
        revenueSplit: values.revenueSplit,
        revenueSplitAmount: values.revenueSplitAmount,
      },
      onCompleted: () => {},
    });
  };
  const cls = isExpanded ? '' : 'display-none';

  return (
    <Form>
      <button type="button" onClick={onToggleVisibility}>
        {isExpanded ? 'Hide' : 'Show'}{' '}
      </button>
      <div className={`d-flex flex-column ${cls}`}>
        <span>
          Artist/Email <InputField type="input" name="toEmail" />
        </span>
        <p className="f6">
          If the artist doesn't artist, simply enter the email and press enter
        </p>
        <CreateableSelect
          loadOptions={onLoadOptions}
          onChange={onSelectArtistProfile}
        />

        <p>Start date</p>
        <DateTimeField name="startDate" />
        <p>End date</p>
        <DateTimeField name="endDate" />

        <Label>Lineup Slot</Label>
        <SelectField options={LINEUP_OPTIONS} name="lineupSlot" />

        <Label>Guarantee</Label>
        <InputField type="number" name="guarantee" />

        <Label>Revenue Split</Label>
        <div className="d-flex">
          <InputField
            disabled={false}
            type="number"
            name="revenueSplitAmount"
          />
          <SelectField
            disabled={false}
            options={AMOUNT_OPTIONS}
            name="revenueSplit"
          />
        </div>

        <div className="d-flex flex-justify-around">
          <Button onClick={onSave}> Save </Button>
        </div>
      </div>
    </Form>
  );
}

BookingInvitationRow.propTypes = {
  bookingInvitation: PropTypes.object,
};

BookingInvitationRow.defaultProps = {
  bookingInvitation: {
    id: createUUID(),
    initiator: 'VENUE',
  },
};

export default BookingInvitationRow;
