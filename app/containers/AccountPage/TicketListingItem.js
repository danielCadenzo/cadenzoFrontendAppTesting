/* eslint-disable no-return-assign */
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { BASE_URL } from 'data/api';
import { DateTime } from 'luxon';
import Button from 'components/Button';
import { DAY_MONTH_TIME_FORMAT } from 'utils/dates';
import { Popover } from 'react-tiny-popover';
import Badge from 'components/Badge';
import { FormattedMessage } from 'react-intl';
import TransferTicketContainer from './TransferTicketContainer';
import TicketResellPopover from './TicketResellPopover';
import { TICKET_TRANSFER_STATUS } from './constants';
import messages from './messages';

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

const CustomComponent = React.forwardRef(({ children, ...rest }, ref) => (
  <div ref={ref} {...rest}>
    {children}
  </div>
));

const TicketListItem = props => {
  const {
    coverImage,
    transfers,
    ticketName,
    address,
    startDate,
    userEmail,
    ticketId,
    uuid,
    eventId,
  } = props;
  const [isResellPopoverVisible, setResellPopover] = useState(false);
  const [isTransferPopoverVisible, setTransferPopover] = useState(false);

  const isResellDisabled =
    transfers &&
    transfers.acceptanceStatus === TICKET_TRANSFER_STATUS.IN_PROGRESS;

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

  const renderStatusBadge = useCallback(() => {
    if (
      transfers &&
      transfers.acceptanceStatus === TICKET_TRANSFER_STATUS.IN_PROGRESS
    ) {
      return (
        <Badge className="rounded-2">
          <FormattedMessage {...messages.inTransfer} />
        </Badge>
      );
    }
    return null;
  }, [transfers]);

  return (
    <TicketWrapper className="rounded p-2 d-flex my-1 flex-justify-between">
      <TicketDiv className="d-flex flex-wrap">
        <div className="d-flex flex-wrap">
          <img
            src={coverImage}
            alt="ticket cover"
            width={120}
            height={100}
            className="mr-3"
          />
          {renderStatusBadge()}
        </div>
        <TicketDiv className="d-flex flex-column">
          <TicketDiv className="d-flex flex-items-center full-width">
            <Header className="work-sans-black f3">
              {'wfnbwroeiubgriugbruigrbeigubreiugbreiuub'}
            </Header>
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
          onClick={() => {
            window.location = `${BASE_URL}/ticket/view/${eventId}/${ticketId}`;
          }}
        >
          Open Ticket
        </Button>
        <Popover
          isOpen={isTransferPopoverVisible}
          position={['left', 'bottom']} // if you'd like, you can limit the positions
          onClickOutside={closePopovers} // handle click events outside of the popover/target here!
          content={() => (
            <TransferTicketContainer
              userEmail={userEmail}
              ticketId={ticketId}
              onClose={closePopovers}
            />
          )}
        >
          <CustomComponent>
            <Button
              className="full-width flex-shrink-0 whitespace-nowrap"
              st
              onClick={openTransferPopover}
            >
              Transfer
            </Button>
          </CustomComponent>
        </Popover>
        <Popover
          isOpen={isResellPopoverVisible}
          position={['left', 'bottom']} // if you'd like, you can limit the positions
          onClickOutside={closePopovers} // handle click events outside of the popover/target here!
          content={() => (
            <TicketResellPopover ticketId={ticketId} onClose={closePopovers} />
          )}
        >
          <CustomComponent>
            <Button
              onClick={openResellPopover}
              disabled={isResellDisabled}
              inverted={isResellDisabled}
              className="full-width whitespace-nowrap"
            >
              Re-sell
            </Button>
          </CustomComponent>
        </Popover>
      </div>
    </TicketWrapper>
  );
};

TicketListItem.propTypes = {
  coverImage: PropTypes.string.isRequired,
  transfers: PropTypes.array,
  ticketName: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  startDate: PropTypes.string.isRequired,
  userEmail: PropTypes.string.isRequired,
  ticketId: PropTypes.string.isRequired,
};

export default TicketListItem;
