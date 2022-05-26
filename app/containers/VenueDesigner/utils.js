/* eslint-disable prettier/prettier */
/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */

'use es6';

/* eslint-disable no-bitwise */
/* eslint-disable func-names */
import * as NodeSchemas from 'containers/VenueDesigner/NodeSchemas';
import { SEAT_HEIGHT } from './constants';

export function createUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const getFieldValue = (fields, fieldLabel) => {
  const foundField = fields.find(field => field.label === fieldLabel);
  if (!foundField) return null;
  return foundField.value;
};

export const getItemPaddingForSegment = (
  segmentLength,
  amountofItems,
  minItemLegnth,
) => {
  // Space around wise like Flexbox
  const itemLengthSize = amountofItems * minItemLegnth;
  if (segmentLength <= itemLengthSize) {
    return 0;
  }
  return (segmentLength - itemLengthSize) / (amountofItems + 2);
};

export const getBaseGridPositions = (
  items,
  itemPerRow,
  container,
  config = {},
) => {
  // Space around wise like Flexbox
  const containerWidth = container.width();
  const containerHeight = container.height();
  const { minItemHeight = 0, minItemWidth = 0 } = config;
  if (!items.length) return null;
  const positions = [];

  items.forEach((item, idx) => {
    if (!item || item.current) return null;
    const actualHeight = minItemHeight || item.height();
    const actualWidth = minItemWidth || item.width();
    const itemHorizPadding =
      getItemPaddingForSegment(containerWidth, items.length, actualWidth) / 2;
    const itemVertPadding = getItemPaddingForSegment(
      containerHeight,
      items.length,
      actualHeight,
    );
    const rowAdjustIndex = Math.ceil((idx + 1) / itemPerRow);
    const columnIndex = idx % itemPerRow;
    const positionY =
      rowAdjustIndex * actualHeight + itemVertPadding * rowAdjustIndex;
    const positionX = actualWidth * columnIndex + itemHorizPadding;
    positions.push({ x: positionX, y: positionY });
  });
  return positions;
};

// Returns adjusts nodes widthin container; returns node positions
export const setPositionedItemsInRect = (
  items,
  itemPerRow,
  container,
  config = {},
) => {
  // Space around wise like Flexbox
  const containerWidth = container.width();
  const containerHeight = container.height();
  const { minItemHeight = 0, minItemWidth = 0 } = config;
  if (!items.length) return null;
  const positions = [];

  items.forEach((item, idx) => {
    if (!item || item.current) return null;
    const actualHeight = minItemHeight || item.height();
    const actualWidth = minItemWidth || item.width();
    const itemHorizPadding =
      getItemPaddingForSegment(containerWidth, items.length, items[0].width()) /
      2;
    const itemVertPadding = getItemPaddingForSegment(
      containerHeight,
      items.length,
      items[0].height(),
    );
    const rowAdjustIndex = Math.ceil((idx + 1) / itemPerRow);
    const columnIndex = idx % itemPerRow;
    const positionY =
      rowAdjustIndex * actualHeight + itemVertPadding * rowAdjustIndex;
    const positionX = actualWidth * columnIndex + itemHorizPadding;
    item.setAttr('x', positionX);
    item.setAttr('y', positionY);
    positions.push({ x: positionX, y: positionY });
  });
  return positions;
};

export const getAllNodePositions = nodes =>
  nodes.map(node => {
    const { x: nodeX, y: nodeY } = node.getClientRect();
    return { x: nodeX, y: nodeY };
  });

export const applySkewToNodes = (skewFactor, positions, amtRows = 1) => {
  const itemsPerRow =
    positions.length / amtRows + (positions.length % amtRows > 0 ? 1 : 0);

  // Only increase/decrease on one side of the divider row
  const skewDividerColumn = itemsPerRow / 2;
  const hasMiddle = itemsPerRow.length % 2 !== 0;

  positions.forEach((node, idx) => {
    // const rowAdjustIndex = Math.ceil((idx + 1) / itemsPerRow);

    const columnIndex = idx % amtRows;

    const currentYPosition = positions[idx].y;
    const distFromMiddle = Math.abs(skewDividerColumn - columnIndex);

    let Ymovement = SEAT_HEIGHT * skewFactor * distFromMiddle;

    if (skewDividerColumn <= columnIndex) Ymovement = -Ymovement;

    if (hasMiddle && distFromMiddle === 0) Ymovement = 0;

    const finalPosition = Ymovement + currentYPosition;
    positions[idx].y = finalPosition;
  });
  return positions;
};

export const applyCurveToNodes = (curveFactor, positions, amtPerRow = 1) => {
  // Only increase/decrease on one side of the divider row
  const skewDividerColumn = Math.floor(amtPerRow / 2);
  const hasMiddle = amtPerRow.length % 2 !== 0;

  positions.forEach((node, idx) => {
    const columnIndex = idx % amtPerRow;
    const distFromMiddle = hasMiddle
      ? Math.abs(skewDividerColumn - columnIndex)
      : Math.min(
        Math.abs(skewDividerColumn - (columnIndex + 1)),
        Math.abs(skewDividerColumn + 1 - (columnIndex + 1)),
      );
    const Ymovement =
      SEAT_HEIGHT * curveFactor + (distFromMiddle + 1) ** 2 * curveFactor;

    const finalYPosition = Ymovement + positions[idx].y;
    positions[idx].y = finalYPosition;
  });
  return positions;
};


export const mergeVenueItemUpdateSchema = (venueItems) => {
  Object.values(venueItems).forEach((item) => {
    const seenFields = {};
    venueItems[item.id].fields = [...item.fields, ...NodeSchemas[item.type].fields].filter((field) => {
      if(seenFields[field.label]) {
        return false;
      } 
      seenFields[field.label] = true;
      return true;
    })
  })
  return venueItems;
}