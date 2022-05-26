/*
 *
 * EventPage actions
 *
 */

import {
  FETCH_SELECTED_EVENT,
  SET_DISCOUNT_CODES,
  ADD_REMOVE_CART_ITEM,
} from './constants';

export const setSelectedEvent = event => dispatch => {
  dispatch({
    type: FETCH_SELECTED_EVENT,
    event,
  });
};

export const setDiscountCodes = allDiscountCodes => dispatch => {
  const reducedItemMap = {};
  const filteredItems = allDiscountCodes.filter(dc => {
    if (!reducedItemMap.hasOwnProperty(dc.id)) {
      reducedItemMap[dc.id] = dc;
      return true;
    }
  });
  dispatch({
    type: SET_DISCOUNT_CODES,
    discountCodes: filteredItems,
  });
};

// use ticket id
export const updateTicketsInCart = (
  {
    ticketGroupId,
    seatMapIndex = null,
    seatMapObjectId = null,
    ptGqlId,
    ticketId = null,
    isMarketplaceItem = false,
  },
  quantity,
) => dispatch => {
  dispatch({
    type: ADD_REMOVE_CART_ITEM,
    payload: {
      ticketGroupId,
      ptGqlId,
      seatMapIndex,
      seatMapObjectId,
      quantity,
      ticketId,
      isMarketplaceItem,
    },
  });
};
