import {
  ADD_VENUE_ITEM,
  REMOVE_VENUE_ITEM,
  VENUE_ITEM_UPDATED,
  SELECT_MAP_NODE,
  UPDATE_NODE_FIELD,
  VENUE_MAP_UPDATED_RECEIVED,
  VENUE_MAP_UPDATED_REQUESTED,
  VENUE_MAP_CREATED,
  FETCH_VENUES_LIST,
  UPDATE_TICKET_TIERS,
  DELETE_TICKET_TIER,
  UPDATE_SEAT_MAPPING,
  VENUE_MAP_FETCHED,
} from 'redux/ActionTypes';
import {
  createUUID,
  mergeVenueItemUpdateSchema,
} from 'containers/VenueDesigner/utils';
import * as NodeSchemas from 'containers/VenueDesigner/NodeSchemas';
import { fromJS } from 'immutable';
import * as venueDesignerClient from 'data/clients/VenueDesignerClient';
import { flattenGQLEdges } from 'utils/helpers';
import { cloneDeep } from 'lodash';

export const addVenueItem = nodeType => dispatch => {
  const newNode = NodeSchemas[nodeType];
  newNode.id = createUUID();
  const seatNode = fromJS(newNode);
  const payload = { seatNode };
  dispatch({
    type: ADD_VENUE_ITEM,
    payload,
  });
};

export const cloneVenueItem = nodeItem => dispatch => {
  const newNode = cloneDeep(nodeItem);
  newNode.id = createUUID();
  const seatNode = fromJS(newNode);
  const payload = { seatNode };
  dispatch({
    type: ADD_VENUE_ITEM,
    payload,
  });
};

export const removeVenueItem = nodeId => dispatch => {
  const payload = { nodeId };
  dispatch({
    type: REMOVE_VENUE_ITEM,
    payload,
  });
};

export const updateVenueItem = updatedNode => dispatch => {
  const { id } = updatedNode;
  const payload = { updatedNode, id };
  dispatch({
    type: VENUE_ITEM_UPDATED,
    payload,
  });
};

export const updateSelectedNode = nodeId => dispatch => {
  const payload = { nodeId };
  dispatch({
    type: SELECT_MAP_NODE,
    payload,
  });
};

export const updateSelectedNodeField = (
  nodeId,
  fieldIndex,
  value,
) => dispatch => {
  const payload = { fieldIndex, value, nodeId };
  dispatch({
    type: UPDATE_NODE_FIELD,
    payload,
  });
};

export const venueMapUpdated = (
  mapId,
  mapName,
  seatingMap,
  seatingInfo = {},
) => dispatch => {
  const payload = { id: mapId, mapName, seatingMap, seatingInfo };

  dispatch({
    type: VENUE_MAP_UPDATED_REQUESTED,
  });
  venueDesignerClient
    .editVenueMap(mapId, mapName, seatingInfo, seatingMap)
    .then(() => {
      dispatch({
        type: VENUE_MAP_UPDATED_RECEIVED,
        payload,
      });
    })
    .catch(() => {});
};

export const createVenueMap = (
  mapName,
  seatingMapChart = {},
  seatingInfo = {},
) => dispatch => {
  const payload = { mapName, seatingMapChart, seatingInfo };
  dispatch({
    type: VENUE_MAP_UPDATED_REQUESTED,
  });
  venueDesignerClient
    .createVenueMap(mapName, seatingInfo, seatingMapChart)
    .then(response => {
      const { createVenueMap: mutationResponse } = response;
      const {
        venueMap: { id, mapName: createdMapName },
      } = mutationResponse;
      dispatch({
        type: VENUE_MAP_UPDATED_RECEIVED,
        payload,
      });

      dispatch({
        type: VENUE_MAP_CREATED,
        payload: {
          id,
          mapName: createdMapName,
        },
      });
    })
    .catch(() => {});
};

export const loadVenueMap = mapId => dispatch => {
  dispatch({
    type: VENUE_MAP_UPDATED_REQUESTED,
  });
  venueDesignerClient
    .fetchVenueMap(mapId)
    .then(response => {
      const { seatingMap, mapName, id } = response.venueMap;
      const { ticketGroups = {}, venueItems = {} } = JSON.parse(seatingMap);
      // update the venue items in case the fields have been updated
      const versionedVenueItemMap = mergeVenueItemUpdateSchema(venueItems);
      const payload = {
        id,
        seatingMap,
        mapName,
        venueItems: versionedVenueItemMap,
        ticketGroups,
      };

      dispatch({
        type: VENUE_MAP_FETCHED,
        payload,
      });
      dispatch({
        type: VENUE_MAP_UPDATED_RECEIVED,
      });
    })
    .catch(() => {});
};

export const venueDesignerItems = email => dispatch => {
  venueDesignerClient.fetchVenueItems(email).then(response => {
    const {
      venueMaps: { edges },
    } = response;
    dispatch({
      type: FETCH_VENUES_LIST,
      payload: {
        items: flattenGQLEdges(edges),
      },
    });
  });
};

export const updateTicketTierInfo = (tierId, ticketMapping) => dispatch => {
  dispatch({
    type: UPDATE_TICKET_TIERS,
    payload: {
      tierId,
      ticketMapping,
    },
  });
};

export const deleteTicketTier = tierId => dispatch => {
  dispatch({
    type: DELETE_TICKET_TIER,
    payload: {
      tierId,
    },
  });
};

export const updateTicketTierSeating = nodeSeatMapping => dispatch => {
  dispatch({
    type: UPDATE_SEAT_MAPPING,
    payload: {
      nodeSeatMapping,
    },
  });
};
