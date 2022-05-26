import { createSelector } from 'reselect';
import { GA_SECTION } from 'containers/VenueDesigner/GraphNodeTypes';
import { getFieldValue } from 'containers/VenueDesigner/utils';
import { flattenGQLEdges } from 'utils/helpers';
import { initialState } from './reducer';

const SEAT_MAP_DEFAULT = { ticketGroups: {}, venueItems: {} };

/**
 * Direct selector to the eventPage state domain
 */

export const selectEventPageDomain = state =>
  state.eventPage.selectedEvent || initialState;

export const selectMarketplaceTicketDomain = state =>
  state.eventPage.marketplaceTickets || [];

export const selectShoppingCartDomain = state =>
  state.eventPage.shoppingCart || { cart: [], discountCodes: [] };

/**
 * Other specific selectors
 */

/**
 * Default selector used by EventPage
 */

export const makeSelectEventPage = () =>
  createSelector(
    selectEventPageDomain,
    substate => substate.selectedEvent,
  );

export const makeSelectShoppingCart = () =>
  createSelector(
    selectShoppingCartDomain,
    substate => substate.cart,
  );

export const makeSelectDiscountCodes = () =>
  createSelector(
    selectShoppingCartDomain,
    substate => substate.discountCodes,
  );

export const isEventLoaded = () =>
  createSelector(
    selectEventPageDomain,
    substate =>
      substate.selectedEvent &&
      Object.prototype.hasOwnProperty.call(substate.selectedEvent, 'id'),
  );

export const isEventFavorited = () =>
  createSelector(
    [makeSelectEventPage(), isEventLoaded()],
    (event, isLoaded) => {
      if (isLoaded) {
        return event.isFavorited;
      }
      return false;
    },
  );

export const doesFollowOrganizer = () =>
  createSelector(
    [makeSelectEventPage(), isEventLoaded()],
    (event, isLoaded) => {
      if (isLoaded) {
        const { organizer } = event;
        return organizer.doesFollow;
      }
      return false;
    },
  );

const getTicketGroupsForEvent = () =>
  createSelector(
    [isEventLoaded(), makeSelectEventPage()],
    (isLoaded, event) => {
      if (isLoaded) {
        return flattenGQLEdges(event.productGroups.edges);
      }
      return [];
    },
  );

const getVenueMapTicketGroups = () =>
  createSelector(
    [isEventLoaded(), makeSelectEventPage()],
    (isLoaded, event) => {
      if (isLoaded && event.venueMap) {
        return Object.values(event.venueMap.seatingMap.ticketGroups);
      }
      return [];
    },
  );

export const getVenueTicketGroupsByGQLId = () =>
  createSelector(
    [getTicketGroupsForEvent(), getVenueMapTicketGroups()],
    (ticketGroups, venueTicketGroups) =>
      venueTicketGroups.reduce((acc, grp) => {
        const foundGroup = ticketGroups.find(group => group.name === grp.name);
        return {
          ...acc,
          [grp.id]: foundGroup.id,
        };
      }, {}),
  );

// get the General Admission Type Tickets
export const getGeneralAdmissionTicketGroupOptions = () =>
  createSelector(
    [makeSelectEventPage(), isEventLoaded()],
    (event, isLoaded) => {
      if (isLoaded) {
        const { venueMap, productGroups } = event;
        const seatingMap = venueMap ? venueMap.seatingMap : SEAT_MAP_DEFAULT;
        const { ticketGroups: seatingMapTicketGroups, venueItems } = seatingMap;
        const nonSeatedTicketOptions = {};
        const allTicketGroups = flattenGQLEdges(productGroups.edges);
        const filteredGAGroups = allTicketGroups.filter(
          value =>
            !Object.values(seatingMapTicketGroups).some(
              seatingGroup => seatingGroup.name === value.name,
            ),
        );

        Object.values(venueItems).forEach(venueMapItem => {
          const { type, seatMap, fields } = venueMapItem;
          const capacity = getFieldValue(fields, 'Capacity');
          if (type === GA_SECTION) {
            const ticketGroupId = seatMap['0'];
            const sectionTicketGroup = seatingMapTicketGroups[ticketGroupId];
            if (ticketGroupId && nonSeatedTicketOptions[ticketGroupId]) {
              nonSeatedTicketOptions[ticketGroupId] = {
                ...nonSeatedTicketOptions[ticketGroupId],
                capacity:
                  nonSeatedTicketOptions[ticketGroupId].capacity + capacity,
              };
            } else if (ticketGroupId && seatingMapTicketGroups[ticketGroupId]) {
              const correspondingGroup = allTicketGroups.find(
                tcktgrp => tcktgrp.name === sectionTicketGroup.name,
              );
              const { name, price: basePrice } = seatingMapTicketGroups[
                ticketGroupId
              ];
              nonSeatedTicketOptions[ticketGroupId] = {
                name,
                capacity,
                description: '',
                basePrice,
                id: correspondingGroup.id,
              };
            }
          }
        });
        return Object.values(nonSeatedTicketOptions).concat(filteredGAGroups);
      }
      return [];
    },
  );

export const shoppingCartQuantityByTicketGroupId = () =>
  createSelector(
    [isEventLoaded(), makeSelectShoppingCart(), getVenueTicketGroupsByGQLId()],
    (isLoaded, shoppingCartItems, venueToGqlMap) => {
      if (isLoaded) {
        return shoppingCartItems.reduce((finalMap, cartItem) => {
          const {
            ticketGroupId,
            quantity,
            seatMapObjectId,
            isMarketplaceItem,
          } = cartItem;
          if (isMarketplaceItem) return finalMap;
          const ticketGroupGQLId = seatMapObjectId
            ? venueToGqlMap[ticketGroupId]
            : ticketGroupId;
          const existingValue = finalMap[ticketGroupGQLId] || 0;
          return {
            ...finalMap,
            [ticketGroupGQLId]: existingValue + quantity,
          };
        }, {});
      }
      return {};
    },
  );

export const getMarketplaceTickets = () =>
  createSelector(
    [selectMarketplaceTicketDomain],
    marketplaceTickets => marketplaceTickets,
  );

export const shoppingCartMarketplaceTickets = () =>
  createSelector(
    [isEventLoaded(), makeSelectShoppingCart(), getMarketplaceTickets()],
    (isLoaded, shoppingCartItems, marketplaceTickets) => {
      if (isLoaded) {
        return shoppingCartItems.reduce((itemMap, cartItem) => {
          const { ticketId, isMarketplaceItem, ticketGroupId } = cartItem;
          if (!isMarketplaceItem) return itemMap;
          const ticket = marketplaceTickets.find(val => val.id === ticketId);
          return {
            ...itemMap,
            [ticketId]: {
              ...ticket,
              ticketGroupId,
              price: ticket.marketplacePrice.toFixed(2),
            },
          };
        }, {});
      }
      return {};
    },
  );

export const generalAdmissionCartByTicketGroupId = () =>
  createSelector(
    [isEventLoaded(), makeSelectShoppingCart()],
    (isLoaded, shoppingCartItems) => {
      if (isLoaded) {
        return shoppingCartItems.reduce((finalMap, cartItem) => {
          const {
            ticketGroupId,
            quantity,
            seatMapIndex,
            isMarketplaceItem,
          } = cartItem;
          if (seatMapIndex || isMarketplaceItem) return finalMap;

          const existingValue = finalMap[ticketGroupId] || 0;
          return {
            ...finalMap,
            [ticketGroupId]: existingValue + quantity,
          };
        }, {});
      }
      return {};
    },
  );
