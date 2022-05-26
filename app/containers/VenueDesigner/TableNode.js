/* eslint-disable no-plusplus */
/* eslint-disable no-underscore-dangle */

'use es6';

import React, { useEffect, useState } from 'react';
import { Group, Rect, Text } from 'react-konva';
import { useDidMount } from 'utils/customHooks';
import PropTypes from 'prop-types';
import { isEqual } from '@material-ui/data-grid';
import { getFieldValue, getItemPaddingForSegment } from './utils';
import SeatNode from './SeatNode';
import { SEAT_WIDTH, SEAT_HEIGHT } from './constants';

const SEAT_VERTICAL_OFFSET = 15;

// Get the East West Seats which we would conventionally call end sets
const calculateEndTableSeatingPositions = (
  seatNode,
  { tableWidth, tableHeight },
  indexInEndTables,
  totalEndTables,
) => {
  const seatsOnLeft = Math.floor(totalEndTables / 2);
  const seatsOnRight = totalEndTables - seatsOnLeft;
  const isOnLeft = indexInEndTables < seatsOnLeft;
  const itemsOnSameSide = isOnLeft ? seatsOnLeft : seatsOnRight;
  const adjustedIndexSideIndex = isOnLeft
    ? indexInEndTables
    : indexInEndTables - seatsOnLeft;

  const padding = getItemPaddingForSegment(
    tableHeight,
    itemsOnSameSide,
    SEAT_HEIGHT,
  );

  const positionY =
    adjustedIndexSideIndex * SEAT_HEIGHT +
    padding * (adjustedIndexSideIndex + 1) +
    SEAT_VERTICAL_OFFSET;

  const positionX = isOnLeft ? -20 : tableWidth + SEAT_WIDTH / 1.5;
  seatNode.setAttr('x', positionX);
  seatNode.setAttr('y', positionY);
};

const calculateNormalSeatingPos = (
  seatNode,
  { tableWidth, tableHeight },
  indexInEndTables,
  totalNonEndTables,
) => {
  const seatsOnTop = Math.ceil(totalNonEndTables / 2);
  const seatsOnBottom = totalNonEndTables - seatsOnTop;
  const isOnTop = indexInEndTables < seatsOnTop;

  const topHorzPadding = getItemPaddingForSegment(
    tableWidth,
    seatsOnTop,
    SEAT_WIDTH,
  );
  const bottomHorzPadding = getItemPaddingForSegment(
    tableWidth,
    seatsOnBottom,
    SEAT_WIDTH,
  );

  const bottomAdjustedIndex = indexInEndTables - seatsOnTop;

  const positionX = isOnTop
    ? indexInEndTables * SEAT_WIDTH +
      topHorzPadding * (indexInEndTables + 1) +
      SEAT_WIDTH / 2
    : bottomAdjustedIndex * SEAT_WIDTH +
      bottomHorzPadding * (bottomAdjustedIndex + 1) +
      SEAT_WIDTH / 2;

  const positionY = isOnTop ? -20 : tableHeight + SEAT_HEIGHT / 2;
  seatNode.setAttr('x', positionX);
  seatNode.setAttr('y', positionY);
};

const TableNode = ({
  schema,
  onSelect,
  onChange,
  tableLabel,
  onUpdateSeatRefs,
  ticketGroupMap,
  seatsSelected,
  onSeatSelect,
  isCustomerMode,
}) => {
  const { x, y, id, fields, seatMap } = schema;

  const textRef = React.useRef();
  const tableRef = React.useRef();
  const groupRef = React.useRef();
  const didMount = useDidMount();
  const [prevSchema, updatePrevSchema] = useState(schema);

  const [positionAnchor, updateAnchor] = React.useState({});

  const seatAmount = getFieldValue(fields, 'Seat Amount');
  const tablePrefix = getFieldValue(fields, 'Table Prefix');
  const startWidth = getFieldValue(fields, 'Start With');
  const nodeRotation = getFieldValue(fields, 'Rotation');
  const endTableAmt = getFieldValue(fields, 'Table End Seating Amount') * 2;

  const nonEndSeatAmt = seatAmount - endTableAmt;
  const rectangeWidth =
    Math.ceil((SEAT_WIDTH * nonEndSeatAmt) / 2) + SEAT_WIDTH;
  const rectangeHeight =
    Math.ceil((SEAT_HEIGHT * endTableAmt) / 2) + SEAT_HEIGHT;

  const seatNodesRefs = React.useRef(Array(seatAmount).fill(null));

  const updateTextCentering = () => {
    const {
      x: rectPositionX,
      y: rectPositionY,
      width: groupWidth,
      height: groupHeight,
    } = tableRef.current.getSelfRect();
    const textWidth = textRef.current.width();
    const textHeight = textRef.current.height();
    const paddingH = groupWidth > textWidth ? (groupWidth - textWidth) / 2 : 0;
    const paddingV =
      groupHeight > textHeight ? (groupHeight - textHeight) / 2 : 0;
    updateAnchor({
      x: paddingH + rectPositionX,
      y: rectPositionY + paddingV,
    });
  };

  const updateSeatMapWithAmount = () => {
    const mappedSeatNodes = Object.keys(seatMap);
    const mergeableMap = {};
    if (mappedSeatNodes.length < seatAmount) {
      for (let i = mappedSeatNodes.length; i < seatAmount; i++) {
        mergeableMap[i] = null;
      }
      onChange({
        ...schema,
        seatMap: {
          ...seatMap,
          ...mergeableMap,
        },
      });
    }
  };

  const handleSeatRefUpdate = () => {
    if (onUpdateSeatRefs && id) onUpdateSeatRefs(id, seatNodesRefs.current);
  };

  // eslint-disable-next-line consistent-return
  const updateSeatingNodes = () => {
    const seatNodeRefs = seatNodesRefs.current;
    if (seatNodeRefs.length) {
      if (!tableRef.current) return null;
      const endTableSeats = seatNodeRefs.slice(0, endTableAmt);
      const nonEndTableSeats = seatNodeRefs.slice(endTableAmt);
      nonEndTableSeats.forEach((seatNode, idx) => {
        if (seatNode)
          calculateNormalSeatingPos(
            seatNode,
            { tableWidth: rectangeWidth, tableHeight: rectangeHeight },
            idx,
            nonEndTableSeats.length,
          );
      });
      endTableSeats.forEach((seatNode, idx) => {
        if (seatNode)
          calculateEndTableSeatingPositions(
            seatNode,
            { tableWidth: rectangeWidth, tableHeight: rectangeHeight },
            idx,
            endTableSeats.length,
          );
      });
    }
    groupRef.current.draw();
  };

  const updateAllPositions = () => {
    updateTextCentering();
    updateSeatMapWithAmount();
    handleSeatRefUpdate();
  };

  if (!isEqual(prevSchema, schema)) {
    const prevSeatAmt = getFieldValue(prevSchema.fields, 'Seat Amount');
    if (prevSchema.fields && seatAmount !== prevSeatAmt) {
      if (prevSeatAmt > seatAmount) {
        seatNodesRefs.current.splice(seatAmount, prevSeatAmt - seatAmount);
      } else {
        seatNodesRefs.current.push(
          ...Array(seatAmount - prevSeatAmt).fill(null),
        );
      }

      updatePrevSchema(schema);
      updateSeatingNodes();
      updateAllPositions();
    }
    if (
      prevSchema.fields &&
      getFieldValue(schema.fields, 'Table End Seating Amount') !==
        getFieldValue(prevSchema.fields, 'Table End Seating Amount')
    ) {
      updatePrevSchema(schema);
      updateSeatingNodes();
      updateAllPositions();
    }
  }

  useEffect(() => {
    if (didMount) {
      updateSeatingNodes();
      updateAllPositions();
    } else {
      updateSeatingNodes();
    }
  }, [didMount]);

  return (
    <React.Fragment>
      <Group
        onDragEnd={() => {
          onChange({
            ...schema,
            x: groupRef.current.x(),
            y: groupRef.current.y(),
          });
          updateTextCentering();
        }}
        draggable={!isCustomerMode}
        x={x}
        y={y}
        ref={groupRef}
        onClick={onSelect}
        onTap={onSelect}
        rotation={nodeRotation}
      >
        <Rect
          fill="#e8e8e8"
          shadowBlur={2}
          ref={tableRef}
          height={rectangeHeight}
          width={rectangeWidth}
          onChange={updateSeatingNodes}
        />
        <Text
          text={`${tablePrefix} ${tableLabel}`}
          ref={textRef}
          fontSize={15}
          padding={10}
          align="center"
          {...positionAnchor}
        />
        {seatNodesRefs.current.map((seat, idx) => {
          if (seatAmount === idx) return null;
          const currentRefs = seatNodesRefs.current;
          const konvaId = (currentRefs[idx] && currentRefs[idx]._id) || null;
          const shapeSelectables = seatsSelected || [];
          const ticketGroupId = schema.seatMap[idx];
          const ticketGroupColor = ticketGroupId
            ? ticketGroupMap[ticketGroupId].color
            : undefined;
          const seatColor =
            isCustomerMode && !ticketGroupColor ? 'black' : ticketGroupColor;

          return (
            <SeatNode
              seatLabel={`${startWidth + idx}`}
              seatMapIndex={idx}
              onDidMount={updateSeatingNodes}
              seatColor={seatColor}
              ticketGroupId={ticketGroupId}
              seatMapObjectId={id}
              onClick={onSeatSelect}
              isSelectable={isCustomerMode && ticketGroupId}
              isSelected={shapeSelectables.some(shape => konvaId === shape._id)}
              getRef={el => {
                seatNodesRefs.current[idx] = el;
              }}
            />
          );
        })}
      </Group>
    </React.Fragment>
  );
};

TableNode.defaultProps = {
  tableLabel: '',
  isCustomerMode: false,
};

TableNode.propTypes = {
  schema: PropTypes.object,
  isSelected: PropTypes.func,
  onSelect: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  tableLabel: PropTypes.string,
  isCustomerMode: PropTypes.bool,
  onSeatSelect: PropTypes.func,
  ticketGroupMap: PropTypes.object,
  seatsSelected: PropTypes.arrayOf(PropTypes.object),
  onUpdateSeatRefs: PropTypes.func,
};

export default TableNode;
