/* eslint-disable no-return-assign */
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { createGQLQuery } from 'data/api';
import { DateTime } from 'luxon';
import Button from 'components/Button';
import { DAY_MONTH_TIME_FORMAT } from 'utils/dates';
import { cadenzoPrimary } from 'utils/CssVariables';
import Badge from 'components/Badge';
import { TICKET_TRANSFER_STATUS } from './constants';

const TicketWrapper = styled.div`
  border: 2px #e1e4e8 solid !important;
`;

const Header = styled.p`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0px;
  max-width: 100%;
`;
const TicketDiv = styled.div`
  min-width: 0px;
`;

const REPLY_TICKET_MUTATION = `
mutation($id: ID!,  $email: String!, $reply: String!){
  replyToTicketTransfer(id:$id,  email: $email, reply: $reply ){
    success
  }
}`;

const CustomComponent = React.forwardRef(({ children, ...rest }, ref) => (
  <div ref={ref} {...rest}>
    {children}
  </div>
));

const TicketTransferRequest = props => {
  const {
    coverImage,
    transfers,
    ticketName,
    address,
    startDate,
    userEmail,
    ticketId,
  } = props;
  const [isResellPopoverVisible, setResellPopover] = useState(false);
  const [isTransferPopoverVisible, setTransferPopover] = useState(false);

  const closePopovers = useCallback(() => {
    setTransferPopover(false);
    setResellPopover(false);
  }, []);

  const openResellPopover = useCallback(() => {
    setResellPopover(true);
  }, []);

  const openTransferPopover = useCallback(() => {
    setTransferPopover(true);
  }, []);

  const acceptTransferRequest = () => {
    createGQLQuery(REPLY_TICKET_MUTATION, {
      id: ticketId,
      email: userEmail,
      reply: TICKET_TRANSFER_STATUS.ACCEPTED,
    });
  };

  const denyTransferRequest = () => {
    createGQLQuery(REPLY_TICKET_MUTATION, {
      id: ticketId,
      email: userEmail,
      reply: TICKET_TRANSFER_STATUS.DENIED,
    });
  };

  const renderStatusPill = useCallback(() => {
    if (
      transfers &&
      transfers.acceptanceStatus === TICKET_TRANSFER_STATUS.IN_PROGRESS
    ) {
      return (
        <Badge
          className="rounded-2 work-sans-black text-bold ml-3"
          backgroundColor={cadenzoPrimary}
          color="white"
        >
          Transfer Received
        </Badge>
      );
    }
  }, [transfers]);

  return (
    <TicketWrapper className="rounded p-2 d-flex my-1 flex-justify-between">
      <TicketDiv className="d-flex">
        <TicketDiv className="d-flex flex-column">
          <TicketDiv className="d-flex flex-items-center full-width">
            <Header className="work-sans-black f3">
              {'wfnbwroeiubgriugbruigrbeigubreiugbreiuub'}
            </Header>
            {renderStatusPill()}
          </TicketDiv>
          <p className="work-sans-black h4">{ticketName}</p>
          {address !== 'None' && (
            <p className="work-sans-black f4">Location: {address}</p>
          )}
          <p className="work-sans-black f4">
            {DateTime.fromISO(startDate).toFormat(DAY_MONTH_TIME_FORMAT)}
          </p>
        </TicketDiv>
      </TicketDiv>
      <div className="d-flex flex-column width-fit-content mx-3">
        <Button
          className="full-width whitespace-nowrap"
          onClick={acceptTransferRequest}
        >
          Accept
        </Button>
        <Button
          className="full-width flex-shrink-0 whitespace-nowrap"
          st
          onClick={denyTransferRequest}
        >
          Deny
        </Button>
      </div>
    </TicketWrapper>
  );
};

TicketTransferRequest.propTypes = {
  coverImage: PropTypes.string.isRequired,
  transfers: PropTypes.array,
  ticketName: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  startDate: PropTypes.string.isRequired,
  userEmail: PropTypes.string.isRequired,
  ticketId: PropTypes.string.isRequired,
};

export default TicketTransferRequest;
