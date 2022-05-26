import React, { Fragment } from 'react';
import Button from 'components/Button';
import Label from 'components/Form/Label';
import { graphql, useMutation } from 'react-relay';

const ACCEPT_BOOKNIG = graphql`
  mutation BookDetailBodyMutation($id: ID) {
    acceptBookingRequest(id: $id) {
      success
    }
  }
`;

const DECLINE_BOOKING = graphql`
  mutation BookDetailBodyAcceptBookingMutation($id: ID) {
    declineBookingRequest(id: $id) {
      success
    }
  }
`;
function BookingDetailSection({ bookingRequest, onModifyBooking }) {
  const {
    id,
    performer: { name },
    datesSelectable,
    lineupSlot,
    stipulations,
    guarantee,
    revenueSplit,
    status,
    revenueSplitAmount,
  } = bookingRequest;

  const [acceptSubmission, acceptIsInFlight] = useMutation(ACCEPT_BOOKNIG);
  const [declineSubmission, declineIsInFlight] = useMutation(DECLINE_BOOKING);

  const onAcceptBooking = () => {
    acceptSubmission({
      variables: {
        id,
      },
    });
  };

  const onDeclineBooking = () => {
    declineSubmission({
      variables: {
        id,
      },
    });
  };

  return (
    <Fragment>
      <div className="d-flex">
        <Label className="mr-2">Date:</Label>
        <p className="f4 text-bold roboto">August 21 2021</p>
      </div>

      <div className="d-flex">
        <Label className="mr-2">Revenue Split:</Label>
        <p className="f4 text-bold roboto">
          {revenueSplit !== 'PERCENTAGE' ? '$' : null}
          {revenueSplitAmount} {revenueSplit === 'PERCENTAGE' ? '%' : null}
        </p>
      </div>

      <div className="d-flex">
        <Label className="mr-2">Guarantee:</Label>
        <p className="f4 text-bold roboto">${guarantee}</p>
      </div>

      <div className="d-flex">
        <Label className="mr-2">Lineup Slot:</Label>
        <p className="f4 text-bold roboto">{lineupSlot}</p>
      </div>

      {stipulations.length && (
        <div className="d-flex flex-column">
          <Label className="mr-2">Stipulations:</Label>
          <ul>
            <li>
              {stipulations.map(stipulation => (
                <p className="f4 roboto"> &#8226; &nbsp; {stipulation}</p>
              ))}
            </li>
          </ul>
        </div>
      )}

      <Button onClick={onModifyBooking} className="full-width f3" inverted>
        Modify
      </Button>
      <Button onClick={onAcceptBooking} className="full-width f3" inverted>
        Accept
      </Button>
      <Button onClick={onDeclineBooking} className="full-width f3" inverted>
        Reject
      </Button>
      <div />
    </Fragment>
  );
}

BookingDetailSection.defaultProps = {
  channel: {
    isDm: true,
    id: 'Q2hhdFJvb21Ob2RlOjU2NzljOWRiLTJmZGEtNDY1MC1iYzAwLWFiNjJkYzFlOTNkNQ==',
    name: null,
    bookingRequests: [
      {
        id: 'Qm9va2luZ1JlcXVlc3ROb2RlOjE=',
        status: 'P',
        performer: { name: 'Romeo' },
        datesSelectable: ['2021-09-21'],
        lineupSlot: 'OPENER',
        stipulations: ['There will be band setup assistance'],
        guarantee: 0,
        revenueSplit: 'PERCENTAGE',
        revenueSplitAmount: 0,
      },
    ],
    messages: { edges: [{ node: { content: 'Booking Request' } }] },
    business: {
      id: 'VmVudWVOb2RlOjc=',
      name: 'Cadenzo Public Space',
      address: { formatted: '12 Rue Pierre Castagnou, 75014 Paris, France' },
    },
  },
};

export default BookingDetailSection;
