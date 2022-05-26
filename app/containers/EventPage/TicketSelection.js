/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import Input from '@material-ui/core/Input';
import Button from 'components/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { BASE_URL, createGQLQuery } from 'data/api';
import { flattenGQLEdges } from 'utils/helpers';
import * as axios from 'axios';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { MOBILE_BREAKPOINT } from 'utils/CssVariables';
import { toFullDate12hr } from 'utils/dates';
import CustomerVenueMap from 'containers/VenueDesigner/CustomerVenueMap';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import * as EventPageActions from './actions';
import { GET_DISCOUNT_CODE_INFO } from './queries';
import * as EventPageSelectors from './selectors';
import { AMOUNT_TYPES } from './constants';
import messages from './messages';

const Container = styled.div`
  display: flex;
  @media (max-width: ${MOBILE_BREAKPOINT}) {
    flex-direction: column;
    flex-wrap: wrap;
  }
`;

const OrderSummaryContainer = styled.div`
  width: 350px;
  @media (max-width: ${MOBILE_BREAKPOINT}) {
    width: 100%;
  }
`;

function TicketSelectionScreen(props) {
  const [showPromo, updateShowPromo] = useState(false);
  const [discountCode, updateDiscountCode] = useState(null);
  const [showMarketplaceTickets, setShowMarketplace] = useState(false);
  const [codeApplied, updateCodeApplied] = useState(false);
  const [discountSpec, updateDiscountSpec] = useState({});
  const [donationAmount, updateDonationAmount] = useState(0.0);

  const {
    dispatch,
    event,
    cart: eventCart,
    discountCodes,
    onIntentCreated,
    onShowDirectCheckout,
    showDirectCheckout,
    updateSelectedSeats,
    selectedSeats,
    gaTicketOptions,
    updateTicketsInCart,
    shoppingCartByGroupId,
    gaCartById,
    shoppingCartMarketplaceTickets,
    shoppingCart,
    vennueNodeIdToGqlMap,
    updateCheckoutTotal,
    updateIsCartFree,
    marketplaceTickets,
  } = props;
  const ticketGroups = flattenGQLEdges(event.productGroups.edges);

  const onPromoHandler = () => {
    updateShowPromo(!showPromo);
  };

  const onChangeDiscountCode = evt => {
    const {
      target: { value },
    } = evt;
    updateDiscountCode(value);
  };

  // Updates the ticket in the cart based on info
  const onSeatClick = (groupInfo, seatInfo) => {
    const { ticketGroupId, seatMapIndex, seatMapObjectId } = seatInfo;
    const ptGqlId = vennueNodeIdToGqlMap[ticketGroupId];
    updateTicketsInCart(
      { ticketGroupId, seatMapIndex, seatMapObjectId, ptGqlId },
      1,
    );
  };

  const toggleShowMarketplace = () => {
    setShowMarketplace(!showMarketplaceTickets);
  };

  const handleUpdateCartForGA = (ticketGroup, targetEvent) => {
    const {
      target: { value: quantity },
    } = targetEvent;
    const { id } = ticketGroup;
    const payload = {
      ticketGroupId: id,
      ptGqlId: id,
      isMarketplaceItem: false,
    };
    updateTicketsInCart(payload, quantity);
  };

  const renderShoppingCart = () => {
    const nonMarketplaceTickets = Object.keys(shoppingCartByGroupId).map(
      ticketGroupId => {
        const grp = ticketGroups.find(group => group.id === ticketGroupId);
        return (
          <div className="d-flex flex-justify-between">
            <p className="work-sans-black">
              {shoppingCartByGroupId[ticketGroupId]} x {grp.name}
            </p>
            <p className="work-sans-black ml-4 mr-1">
              $
              {(shoppingCartByGroupId[ticketGroupId] * grp.basePrice).toFixed(
                2,
              )}
            </p>
          </div>
        );
      },
    );

    const marketplaceTicketsCart = Object.values(
      shoppingCartMarketplaceTickets,
    ).map(ticketInfo => {
      const { ticketGroupId, price } = ticketInfo;
      const grp = ticketGroups.find(group => group.id === ticketGroupId);
      return (
        <div className="d-flex flex-justify-between">
          <p className="work-sans-black">1 x {grp.name}</p>
          <p className="work-sans-black ml-4 mr-1">${price}</p>
        </div>
      );
    });

    return (
      <Fragment>
        {nonMarketplaceTickets}
        {marketplaceTicketsCart}
      </Fragment>
    );
  };

  const getDiscountAmount = () => {
    if (!codeApplied) return 0;
    const { ticketId, amountDiscounted, type } = discountSpec;

    if (!eventCart.hasOwnProperty(ticketId) || eventCart[ticketId] === 0)
      return 0;

    const grp = ticketGroups.find(group => group.id === ticketId);

    if (!grp) return 0;

    let dollarAmount = 0;

    if (type === AMOUNT_TYPES.PERCENTAGE) {
      dollarAmount =
        -(grp.basePrice * (amountDiscounted / 100)) * eventCart[ticketId];
    } else {
      dollarAmount = -(grp.basePrice * amountDiscounted) * eventCart[ticketId];
    }

    return dollarAmount;
  };

  const renderDiscount = () => {
    const dollarAmount = getDiscountAmount();
    if (dollarAmount === 0) return null;

    return (
      <div className="d-flex flex-justify-between">
        <p className="work-sans-black">
          Discount Code - {discountCode.toUpperCase()}
        </p>
        <p className="work-sans-black ml-4 mr-1">${dollarAmount.toFixed(2)}</p>
      </div>
    );
  };

  const getItemTotal = () =>
    Object.keys(shoppingCartByGroupId).reduce((acc, ticketGroupId) => {
      const grp = ticketGroups.find(group => group.id === ticketGroupId);
      return acc + shoppingCartByGroupId[ticketGroupId] * grp.basePrice;
    }, 0) +
    Object.values(shoppingCartMarketplaceTickets).reduce(
      (acc, ticket) => acc + ticket.marketplacePrice,
      0,
    );

  const renderTotal = () => {
    const discountAmount = getDiscountAmount();
    const lineItemCost = getItemTotal();
    const total = lineItemCost + discountAmount + donationAmount;

    if (total === 0 && !showDirectCheckout) {
      onShowDirectCheckout(true);
    }
    if (total !== 0 && showDirectCheckout) {
      onShowDirectCheckout(false);
    }
    return (
      <div className="d-flex flex-justify-between border-top my-2 pt-2">
        <p className="work-sans-black">Total</p>
        <p className="work-sans-black ml-4 mr-1">${total.toFixed(2)}</p>
      </div>
    );
  };

  const generatePaymentIntent = () => {
    const url = `${BASE_URL}/intent/`;

    const discountAmount = getDiscountAmount();

    axios
      .get(url, {
        header: {
          'Content-Type': 'application/json',
        },
        params: {
          items: shoppingCart,
          discountCode: codeApplied ? discountCode : null,
          donation: donationAmount || 0,
          discountAmount,
        },
      })
      .then(async resp => {
        const response = await resp.data;
        updateCheckoutTotal(response.amount);
        updateIsCartFree(response.isZero);
        onIntentCreated(response.id);
      });
  };

  const onVerifyDiscountCode = () => {
    const { setDiscountCodes } = props;
    if (discountCode !== '') {
      createGQLQuery(GET_DISCOUNT_CODE_INFO, {
        ids: Object.keys(eventCart),
        discountCode,
      }).then(data => {
        const dc = data.checkDiscountCode;
        if (dc) {
          discountCodes.push(dc);
          updateDiscountSpec({
            ticketId: dc.ticketGroup.id,
            type: dc.discountType, // percent or amount
            amountDiscounted: dc.discountAmount,
            code: dc,
          });
          updateCodeApplied(true);
          dispatch(setDiscountCodes(discountCodes));
        } else {
          updateCodeApplied(false);
          updateDiscountSpec({});
        }
      });
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handleDonationChange = e => {
    let { value } = e.target;
    value = parseFloat(parseFloat(value).toFixed(2));
    // eslint-disable-next-line no-restricted-globals
    if (Number.isNaN(value) || isNaN(value)) {
      updateDonationAmount(0.0);
    } else {
      updateDonationAmount(value);
    }
  };

  const onToggleMarketplaceTicketToCart = (ticketId, productGroupId) => {
    if (shoppingCartMarketplaceTickets[ticketId]) {
      updateTicketsInCart(
        {
          ticketGroupId: productGroupId,
          ticketId,
          ptGqlId: productGroupId,
          isMarketplaceItem: true,
        },
        0,
      );
    } else {
      updateTicketsInCart(
        {
          ticketGroupId: productGroupId,
          ticketId,
          ptGqlId: productGroupId,
          isMarketplaceItem: true,
        },
        1,
      );
    }
  };

  const isCheckoutButtonEnabled = shoppingCart.length;

  const eventStart = new Date(event.startDate);
  const eventEnd = new Date(event.endDate);

  const ticketLimit = codeApplied ? 2 : 11;

  const renderVenueMap = () => {
    const { venueMap } = event;
    if (!venueMap) return null;

    const { seatingMap, mapName } = venueMap;
    const { ticketGroups: ticketMapping = {}, venueItems = {} } = seatingMap;

    return (
      <CustomerVenueMap
        venueMapName={mapName}
        onUpdateSeatsSelected={onSeatClick}
        venueItems={venueItems}
        ticketGroupMapping={ticketMapping}
        updateSelectedSeats={updateSelectedSeats}
        selectedSeats={selectedSeats}
      />
    );
  };

  const renderTickets = () => {
    if (showMarketplaceTickets) return null;

    return gaTicketOptions.map(grp => (
      <div className="d-flex my-4 flex-justify-between flex-items-center">
        <div className="d-flex flex-column">
          <p className="f4 work-sans-black text-bold">{grp.name}</p>
          <p className="f5 work-sans-black text-bold">
            ${grp.basePrice.toFixed(2)}
          </p>
          <p className="f4 work-sans-black color-gray">{grp.description}</p>
        </div>

        <div>
          <Select
            value={gaCartById[grp.id]}
            onChange={val => handleUpdateCartForGA(grp, val)}
            defaultValue={0}
            className="m-3"
          >
            {[...Array(ticketLimit).keys()].map(numb => (
              <MenuItem value={numb}>{numb}</MenuItem>
            ))}
          </Select>
        </div>
      </div>
    ));
  };

  const renderMarketplaceTickets = () => {
    if (!showMarketplaceTickets) return null;
    return marketplaceTickets.map(ticket => {
      const { id } = ticket;
      const translationKey = shoppingCartMarketplaceTickets[id]
        ? 'removeTicket'
        : 'buyTicket';

      return (
        <div className="d-flex my-4 flex-justify-between flex-items-center">
          <div className="d-flex flex-column">
            <p className="f4 work-sans-black text-bold">
              {ticket.productType.name}
            </p>
            <p className="f5 work-sans-black text-bold">
              ${ticket.marketplacePrice.toFixed(2)}
            </p>
            <p className="f4 work-sans-black color-gray">
              {ticket.productType.description}
            </p>
          </div>
          <div>
            <Button
              onClick={() =>
                onToggleMarketplaceTicketToCart(
                  ticket.id,
                  ticket.productType.id,
                  ticket.marketplacePrice.toFixed(2),
                )
              }
            >
              <FormattedMessage {...messages[translationKey]} />
            </Button>
          </div>
        </div>
      );
    });
  };

  return (
    <Container className="d-flex">
      <div
        style={{ minWidth: 0, overflowY: 'auto' }}
        className="d-flex flex-column p-3 full-width"
      >
        <div className="mb-2 pb-1 border-bottom">
          <div className="f4 my-2">{event.title} </div>
          <div className="f6">
            {toFullDate12hr(eventStart)} – {toFullDate12hr(eventEnd)}
          </div>
        </div>
        {renderVenueMap()}
        {showPromo ? (
          <div className="d-flex mt-3">
            <Input
              onChange={onChangeDiscountCode}
              placeholder="Enter Promo Code"
            />
            <Button onClick={onVerifyDiscountCode} inverted>
              Apply
            </Button>
          </div>
        ) : (
          <Button inverted className="mt-3" onClick={onPromoHandler}>
            Enter Promo Code
          </Button>
        )}
        {codeApplied ? <p>You can only apply this code to one ticket</p> : null}
        <div>
          <b className="text-bold f3 mt-5">Tickets</b>
          {marketplaceTickets.length && (
            <Button className="ml-4" onClick={toggleShowMarketplace}>
              View Marketplace
            </Button>
          )}
        </div>
        {renderTickets()}
        {renderMarketplaceTickets()}
      </div>

      <OrderSummaryContainer className="d-flex full-width flex-column flex-justify-between flex-self-baseline">
        <div>
          <img
            className="full-width"
            style={{ minHeight: 150 }}
            src={event.coverImage}
            alt="event"
          />
          <b className="work-sans-black text-bold my-3">Order Summary</b>
          {renderShoppingCart()}
          {renderDiscount()}
        </div>
        <div>
          {renderTotal()}
          <Button
            onClick={generatePaymentIntent}
            className="px-4 py-2 my-4 flex-self-center"
            disabled={!isCheckoutButtonEnabled}
            inverted={!isCheckoutButtonEnabled}
          >
            Checkout
          </Button>
        </div>
      </OrderSummaryContainer>
    </Container>
  );
}

TicketSelectionScreen.propTypes = {
  cart: PropTypes.object,
  event: PropTypes.object.isRequired,
  onIntentCreated: PropTypes.func.isRequired,
  onShowDirectCheckout: PropTypes.func.isRequired,
  showDirectCheckout: PropTypes.bool.isRequired,
  gaTicketOptions: PropTypes.array.isRequired,
  vennueNodeIdToGqlMap: PropTypes.object.isRequired,
  shoppingCart: PropTypes.array.isRequired,
  updateSelectedSeats: PropTypes.func,
  updateCheckoutTotal: PropTypes.func,
  updateIsCartFree: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  discountCodes: EventPageSelectors.makeSelectDiscountCodes(),
  shoppingCartByGroupId: EventPageSelectors.shoppingCartQuantityByTicketGroupId(),
  shoppingCartMarketplaceTickets: EventPageSelectors.shoppingCartMarketplaceTickets(),
  gaCartById: EventPageSelectors.generalAdmissionCartByTicketGroupId(),
  shoppingCart: EventPageSelectors.makeSelectShoppingCart(),
  vennueNodeIdToGqlMap: EventPageSelectors.getVenueTicketGroupsByGQLId(),
  marketplaceTickets: EventPageSelectors.getMarketplaceTickets(),
});

const mapDispatchToProps = {
  setDiscountCodes: EventPageActions.setDiscountCodes,
  updateTicketsInCart: EventPageActions.updateTicketsInCart,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(TicketSelectionScreen);
