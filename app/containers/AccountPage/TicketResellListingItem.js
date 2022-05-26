/* eslint-disable no-return-assign */
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { createGQLQuery } from 'data/api';
import { DateTime } from 'luxon';
import { FormattedMessage } from 'react-intl';
import Button from 'components/Button';
import { DAY_MONTH_TIME_FORMAT } from 'utils/dates';
import { cadenzoPrimary } from 'utils/CssVariables';
import Badge from 'components/Badge';
import { priceToDollars } from 'utils/helpers';
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

const SELL_TICKET = `
mutation($ticketId: ID!,  $price: Int!,$isOnMarketplace: Boolean!){
  placeTicketOnMarketplace(id:$ticketId,  price: $price, isOnMarketplace: $isOnMarketplace ){
    success
  }
}`;

const TicketTransferRequest = props => {
  const {
    transfers,
    ticketName,
    address,
    startDate,
    marketplacePrice,
    ticketId,
  } = props;

  const removeFromMarketplace = () => {
    createGQLQuery(SELL_TICKET, {
      ticketId,
      isOnMarketplace: false,
      price: marketplacePrice,
    });
  };

  const renderStatusPill = useCallback(
    () => (
      <Badge
        className="rounded-2 work-sans-black text-bold ml-3"
        backgroundColor={cadenzoPrimary}
        color="white"
      >
        <FormattedMessage {...messages.onMarketplace} />
      </Badge>
    ),
    [transfers],
  );

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
          <p className="work-sans-black f4">
            Price: ${priceToDollars(marketplacePrice).toFixed(2)}
          </p>
        </TicketDiv>
      </TicketDiv>
      <div className="d-flex flex-column width-fit-content mx-3">
        <Button
          className="full-width whitespace-nowrap"
          onClick={removeFromMarketplace}
        >
          Remove
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
  marketplacePrice: PropTypes.number,
};

export default TicketTransferRequest;
