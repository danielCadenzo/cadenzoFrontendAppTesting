/*
 *
 * EventPage reducer
 *
 */
import produce from 'immer';
import {
  FOLLOW_ORGANIZER,
  UNFOLLOW_ORGANIZER,
  FETCH_MARKETPLACE_TICKETS,
} from 'redux/ActionTypes';
import { combineReducers } from 'redux';
import {
  FETCH_SELECTED_EVENT,
  SET_DISCOUNT_CODES,
  ADD_REMOVE_CART_ITEM,
} from './constants';

export const initialState = {};

/* eslint-disable default-case, no-param-reassign */
const selectedEvent = (state = initialState, action) =>
  produce(state, (/* draft */) => {
    switch (action.type) {
      case FETCH_SELECTED_EVENT: {
        const { event } = action;
        return { ...state, selectedEvent: { ...event } };
      }
      case SET_DISCOUNT_CODES: {
        const { discountCodes } = action;
        return {
          ...state,
          discountCodes,
        };
      }
      case UNFOLLOW_ORGANIZER:
      case FOLLOW_ORGANIZER: {
        const { type } = action;
        const { selectedEvent } = state;
        const { organizer } = selectedEvent;
        return {
          ...state,
          selectedEvent: {
            ...selectedEvent,
            organizer: {
              ...organizer,
              doesFollow: !!(type === FOLLOW_ORGANIZER),
            },
          },
        };
      }
      default:
        return state;
    }
  });

const initialShoppingCart = {
  cart: [],
  discountCodes: [],
};

const shoppingCart = (state = initialShoppingCart, action) =>
  produce(state, () => {
    switch (action.type) {
      case SET_DISCOUNT_CODES: {
        const { discountCodes } = action;
        return {
          ...state,
          discountCodes,
        };
      }
      case ADD_REMOVE_CART_ITEM: {
        const {
          ticketGroupId,
          seatMapIndex,
          seatMapObjectId,
          quantity,
          isMarketplaceItem,
        } = action.payload;
        const { cart } = state;

        // if seatMapSeat (non-GA) then check if its already in cart if so remove it
        const itemIndex = cart.findIndex(
          cartItem =>
            seatMapIndex &&
            cartItem.seatMapIndex === seatMapIndex &&
            cartItem.seatMapObjectId === seatMapObjectId,
        );
        // if seatMap seat and not in cart add it otherwise remove it
        if (seatMapIndex && seatMapIndex >= 0) {
          if (itemIndex === -1) {
            return {
              ...state,
              cart: [...cart, action.payload],
            };
          }
          // remove ticket at seat
          cart.splice(itemIndex, 1);
          return {
            ...state,
            cart: [...cart],
          };
        }
        // this is a GA ticket
        const filterId = isMarketplaceItem ? 'ticketId' : 'ticketGroupId';
        const cartItemIndex = cart.findIndex(
          cartItem =>
            action.payload[filterId] === cartItem[filterId] &&
            !cartItem.seatMapIndex &&
            isMarketplaceItem === cartItem.isMarketplaceItem,
        );
        if (cartItemIndex !== -1 && quantity === 0) {
          // delete the GA tickets if quantity is zero
          cart.splice(cartItemIndex, 1);
          return {
            ...state,
            cart: [...cart],
          };
        }
        if (cartItemIndex !== -1) {
          cart.splice(cartItemIndex, 1, action.payload);
          return {
            ...state,
            cart: [...cart],
          };
        }
        cart.push(action.payload);
        return {
          ...state,
          cart: [...cart],
        };
      }
    }
  });

const marketplaceTickets = (state = null, action) =>
  produce(state, () => {
    switch (action.type) {
      case FETCH_MARKETPLACE_TICKETS:
        return action.payload;
      default:
        return state;
    }
  });

export default combineReducers({
  selectedEvent,
  shoppingCart,
  marketplaceTickets,
});
