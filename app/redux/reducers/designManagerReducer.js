'use es6';

/* eslint-disable no-param-reassign */
import produce from 'immer';
import { combineReducers } from 'redux';
import {
  ADD_VENUE_ITEM,
  REMOVE_VENUE_ITEM,
  VENUE_ITEM_UPDATED,
  SELECT_MAP_NODE,
  UPDATE_NODE_FIELD,
  VENUE_MAP_UPDATED_REQUESTED,
  VENUE_MAP_UPDATED_RECEIVED,
  VENUE_MAP_UPDATED_FAILED,
  FETCH_VENUES_LIST,
  UPDATE_SEAT_MAPPING,
  VENUE_MAP_CREATED,
  UPDATE_TICKET_TIERS,
  DELETE_TICKET_TIER,
  VENUE_MAP_FETCHED,
} from 'redux/ActionTypes';
import { Map, List, fromJS } from 'immutable';
import * as RequestStates from 'redux/RequestStates';

const venueMaps = (state = new List(), action) =>
  produce(state, () => {
    switch (action.type) {
      default:
        return state;
    }
  });

const selectedNodeId = (state = null, action) =>
  produce(state, () => {
    switch (action.type) {
      case SELECT_MAP_NODE: {
        const {
          payload: { nodeId },
        } = action;
        return nodeId;
      }
      default:
        return state;
    }
  });

const ticketGroupMapping = (state = {}, action) =>
  produce(state, () => {
    switch (action.type) {
      case UPDATE_TICKET_TIERS: {
        const {
          payload: { tierId, ticketMapping },
        } = action;
        return {
          ...state,
          [tierId]: ticketMapping,
        };
      }
      case DELETE_TICKET_TIER: {
        const {
          payload: { tierId },
        } = action;
        const newState = { ...state };
        delete newState[tierId];
        return newState;
      }
      case VENUE_MAP_FETCHED: {
        const {
          payload: { ticketGroups },
        } = action;
        return { ...ticketGroups };
      }
      default:
        return state;
    }
  });

const venueItems = (state = new Map({}), action) =>
  produce(state, () => {
    switch (action.type) {
      case ADD_VENUE_ITEM: {
        const {
          payload: { seatNode },
        } = action;
        return state.set(seatNode.get('id'), seatNode);
      }
      case VENUE_ITEM_UPDATED: {
        const {
          payload: { updatedNode, id },
        } = action;
        return state.set(id, fromJS(updatedNode));
      }
      case UPDATE_NODE_FIELD: {
        const {
          payload: { fieldIndex, value, nodeId },
        } = action;
        return state.setIn([nodeId, 'fields', fieldIndex, 'value'], value);
      }
      case REMOVE_VENUE_ITEM: {
        const {
          payload: { nodeId },
        } = action;
        return state.delete(nodeId);
      }
      case UPDATE_SEAT_MAPPING: {
        const {
          payload: { nodeSeatMapping },
        } = action;
        return Object.keys(nodeSeatMapping).reduce(
          (newState, mapNodeId) =>
            newState.setIn(
              [mapNodeId, 'seatMap'],
              new Map({
                ...newState.getIn([mapNodeId, 'seatMap']).toJS(),
                ...nodeSeatMapping[mapNodeId],
              }),
            ),
          state,
        );
      }
      case VENUE_MAP_FETCHED: {
        const {
          payload: { venueItems: fetchedVenueItems },
        } = action;
        return fromJS({ ...fetchedVenueItems });
      }
      default:
        return state;
    }
  });

const editorInfo = (
  state = new Map({
    lastEditTimeStamp: new Date().getTime(),
    autosaveRequestStatus: RequestStates.UNINITIALIZED,
    venueSelectOptions: [],
    selectedVenueId: null,
    selectedMapName: null,
  }),
  action,
) =>
  produce(state, () => {
    switch (action.type) {
      case VENUE_ITEM_UPDATED:
      case UPDATE_NODE_FIELD: {
        return state.set('lastEditTimeStamp', new Date().getTime());
      }
      case VENUE_MAP_UPDATED_REQUESTED:
        return state.set('autosaveRequestStatus', RequestStates.REQUESTED);
      case VENUE_MAP_UPDATED_RECEIVED:
        return state.set('autosaveRequestStatus', RequestStates.SUCCEEDED);
      case VENUE_MAP_UPDATED_FAILED:
        return state.set('autosaveRequestStatus', RequestStates.FAILED);
      case VENUE_MAP_CREATED: {
        const {
          payload: { id, mapName },
        } = action;
        return state.set('selectedVenueId', id).set('selectedMapName', mapName);
      }
      case FETCH_VENUES_LIST: {
        const {
          payload: { items },
        } = action;
        return state.set('venueSelectOptions', items);
      }
      case VENUE_MAP_FETCHED: {
        const {
          payload: { id, mapName },
        } = action;
        return state.set('selectedVenueId', id).set('selectedMapName', mapName);
      }
      default:
        return state;
    }
  });
export default combineReducers({
  venueMaps,
  selectedNodeId,
  venueItems,
  editorInfo,
  ticketGroupMapping,
});
