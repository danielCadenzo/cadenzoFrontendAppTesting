/* eslint-disable default-case */
import { createSelector } from 'reselect';
import { getFieldValue } from 'containers/VenueDesigner/utils';
import * as GraphNodeTypes from 'containers/VenueDesigner/GraphNodeTypes';

export const getUserAuth = state => state.authReducer;

const getVenueItems = state => state.venueDesigner.venueItems;

const getSelectedNode = state => state.venueDesigner.selectedNodeId;

const getEditorInfo = state => state.venueDesigner.editorInfo;

const getTicketGroupInfo = state => state.venueDesigner.ticketGroupMapping;

export const getAuthEmail = () =>
  createSelector(
    [getUserAuth],
    userAuth => userAuth.email,
  );

export const getVenueItemNodes = () =>
  createSelector(
    [getVenueItems],
    venueItemMap => venueItemMap.valueSeq().toJS(),
  );

export const getVenueItemMap = () =>
  createSelector(
    [getVenueItems],
    venueItemMap => venueItemMap.toJS(),
  );

export const getSelectedMapNodeId = () =>
  createSelector(
    [getSelectedNode],
    id => id || null,
  );

export const getEditorBufferTimestamp = () =>
  createSelector(
    [getEditorInfo],
    info => info.get('lastEditTimeStamp'),
  );

export const getSelectedMapNode = () =>
  createSelector(
    [getSelectedMapNodeId(), getVenueItems],
    (nodeId, nodeMap) =>
      nodeId && nodeMap.get(nodeId) ? nodeMap.get(nodeId).toJS() : null,
  );

export const getSelectedMapNodeFields = () =>
  createSelector(
    [getSelectedMapNode()],
    node => (node ? node.fields : []),
  );

export const getEditorSaveRequestState = () =>
  createSelector(
    [getEditorInfo],
    editorInfo => editorInfo.get('autosaveRequestStatus'),
  );

export const getVenueSelectOptions = () =>
  createSelector(
    [getEditorInfo],
    editorInfo => editorInfo.get('venueSelectOptions'),
  );

export const getTicketTierMapping = () =>
  createSelector(
    [getTicketGroupInfo],
    ticketGroupInfo => ticketGroupInfo,
  );

export const getVenueMapName = () =>
  createSelector(
    [getEditorInfo],
    editorInfo => editorInfo.get('selectedMapName'),
  );

export const getVenueMapId = () =>
  createSelector(
    [getEditorInfo],
    editorInfo => editorInfo.get('selectedVenueId'),
  );

export const getTicketGroupSeatCount = () =>
  createSelector(
    [getVenueItemNodes(), getTicketGroupInfo],
    venueItemNodes => {
      const ticketTierCount = {};
      venueItemNodes.forEach(mapNode => {
        const { seatMap } = mapNode;
        switch (mapNode.type) {
          case GraphNodeTypes.ASSIGNED_SEATING_SECTION: {
            Object.keys(mapNode.seatMap).forEach(seatId => {
              const tierId = seatMap[seatId];
              // eslint-disable-next-line no-prototype-builtins
              if (!ticketTierCount.hasOwnProperty(tierId)) {
                ticketTierCount[tierId] = 0;
              }
              // eslint-disable-next-line no-prototype-builtins

              const tierSeatCount = ticketTierCount[tierId] + 1;
              ticketTierCount[tierId] = tierSeatCount;
            });
            break;
          }
          case GraphNodeTypes.GA_SECTION: {
            let seatCount =
              (mapNode.seatMap['0'] && ticketTierCount[mapNode.seatMap['0']]) ||
              0;
            if (mapNode.seatMap['0']) {
              seatCount += getFieldValue(mapNode.fields, 'Seat Amount');
              ticketTierCount[mapNode.seatMap['0']] = seatCount;
            }
            break;
          }
        }
      });
      return ticketTierCount;
    },
  );
