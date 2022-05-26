/* eslint-disable no-underscore-dangle */
/* eslint-disable no-plusplus */

'use es6';

import React, { useEffect, useState, useMemo } from 'react';
import { Group } from 'react-konva';
import { useDidMount, usePrevious } from 'utils/customHooks';
import PropTypes from 'prop-types';
import { isEqual } from '@material-ui/data-grid';
import { List as ImmutableList } from 'immutable';
import {
  getFieldValue,
  applyCurveToNodes,
  applySkewToNodes,
  getBaseGridPositions,
} from './utils';
import SeatNode from './SeatNode';
import LabelNode from './LabelNode';
import {
  SEAT_WIDTH,
  SEAT_HEIGHT,
  ALPHABETICAL_LABELS,
  ALPHABETICAL_ORDER,
  NUMERICAL_ORDER,
  ODD_NUMERICAL_ORDER,
} from './constants';

const SEAT_WITH_PADDING = 40;

const AssignSeatingSection = ({
  schema,
  onSelect,
  onChange,
  redrawParent,
  onUpdateSeatRefs,
  seatsSelected,
  ticketGroupMap,
  isCustomerMode,
  onSeatSelect,
}) => {
  const { x, y, fields, id, seatMap } = schema;

  const containerRef = React.useRef();
  const didMount = useDidMount();
  const prevSchema = usePrevious(schema);
  const seatPositions = useState(Array(seatAmount).fill({ x: 0, y: 0 }));
  // eslint-disable-next-line no-unused-vars
  const prevPositions = usePrevious(seatPositions);

  const seatAmount = getFieldValue(fields, 'Seat Amount');
  const seatCountPerRow = getFieldValue(fields, 'Seat count per Row');
  const seatOrdering = getFieldValue(fields, 'Row Label');
  // row-wise labeling
  const rowSeatLabel = getFieldValue(fields, 'Row Seat Label');
  const containerSkew = getFieldValue(fields, 'Skew');
  const containerCurve = getFieldValue(fields, 'Curve');
  const rotation = getFieldValue(fields, 'Rotation');

  const amountofRows =
    Math.floor(seatAmount / seatCountPerRow) +
    (seatAmount % seatCountPerRow > 0 ? 1 : 0);

  const containerWidth = Math.ceil(SEAT_WITH_PADDING * (seatAmount + 1));
  const containerHeight = Math.ceil(
    (Math.ceil(seatAmount / seatCountPerRow) + 1) * SEAT_WITH_PADDING,
  );

  const seatNodesRefs = React.useRef(
    useMemo(() => Array(seatAmount).fill(null), [seatAmount]),
  );
  const labelingRowRefs = React.useRef(
    useMemo(() => Array(amountofRows).fill(null), [seatAmount]),
  );

  const handleSeatRefUpdate = () => {
    if (onUpdateSeatRefs && id) onUpdateSeatRefs(id, seatNodesRefs.current);
  };

  const setSkewToSeatNodes = positions =>
    applySkewToNodes(containerSkew, positions, seatCountPerRow + 1);

  const setCurveToSeatNodes = positions =>
    applyCurveToNodes(containerCurve, positions, seatCountPerRow + 1);

  const getSeatingPositions = () => {
    const seatNodeRefs = ImmutableList(seatNodesRefs.current);
    let seatAndLabelNodeRefs = seatNodeRefs.asImmutable();
    const labelRefs = labelingRowRefs.current;

    if (!seatNodeRefs || !labelRefs) return null;
    if (!containerRef) return null;

    const rowCountWithLabels = seatCountPerRow + 1;

    labelRefs.forEach((lbl, idx) => {
      const indexToInsert = seatCountPerRow * idx + 1 * idx;
      seatAndLabelNodeRefs = seatAndLabelNodeRefs.insert(indexToInsert, lbl);
    });

    const nodes = seatAndLabelNodeRefs.toJS();

    let positions = getBaseGridPositions(
      nodes,
      rowCountWithLabels,
      containerRef.current,
      {
        minItemHeight: SEAT_HEIGHT,
        minItemWidth: SEAT_WIDTH,
      },
    );
    positions = setSkewToSeatNodes(positions);
    positions = setCurveToSeatNodes(positions);

    return [nodes, positions];
  };

  const updateSeatingNodes = () => {
    const [nodes, positions] = getSeatingPositions();

    positions.forEach((pos, idx) => {
      if (nodes[idx]) {
        nodes[idx].setAttr('x', pos.x);
        nodes[idx].setAttr('y', pos.y);
      }
    });

    handleSeatRefUpdate();
    redrawParent();
  };

  const handleSeatNodesMounted = seatIndex => {
    if (seatIndex - 1 === seatAmount) {
      updateSeatingNodes();
    }
  };

  const generateRowLabels = () => {
    let valuesToMap = [];
    switch (seatOrdering) {
      case ALPHABETICAL_ORDER:
        valuesToMap = ALPHABETICAL_LABELS.slice(0, amountofRows);
        break;
      case NUMERICAL_ORDER:
        for (let i = 0; i < amountofRows; i++) {
          valuesToMap.push(i + 1);
        }
        break;
      case ODD_NUMERICAL_ORDER:
        for (let i = 0; i < amountofRows; i++) {
          valuesToMap.push(i * 2 + 1);
        }
        break;
      default:
        valuesToMap = [];
    }
    return valuesToMap;
  };

  const getRowSeatLabel = columnIndex => {
    switch (rowSeatLabel) {
      case ALPHABETICAL_ORDER:
        return ALPHABETICAL_LABELS[columnIndex];
      case NUMERICAL_ORDER:
        return `${columnIndex + 1}`;
      case ODD_NUMERICAL_ORDER:
        return `${columnIndex * 2 + 1}`;
      default:
        return `${columnIndex + 1}`;
    }
  };

  const renderRowLabels = () => {
    const rowLabels = generateRowLabels();
    return rowLabels.map((label, idx) => {
      const rowLabel = labelingRowRefs.current[idx];
      const xValue = rowLabel ? rowLabel.getAttr('x') : 0;
      const yValue = rowLabel ? rowLabel.getAttr('y') : 0;
      return (
        <LabelNode
          label={label}
          height={SEAT_HEIGHT}
          width={SEAT_WIDTH}
          fill="black"
          size={20}
          getRef={el => {
            labelingRowRefs.current[idx] = el;
          }}
          schema={{
            x: xValue,
            y: yValue,
            fields: [],
          }}
          onDidMount={updateSeatingNodes}
        />
      );
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

  if (prevSchema && !isEqual(prevSchema, schema)) {
    if (
      prevSchema.fields &&
      seatAmount !== getFieldValue(prevSchema.fields, 'Seat Amount')
    ) {
      seatNodesRefs.current = Array(seatAmount).fill(null);
      updateSeatingNodes();
      updateSeatMapWithAmount();
    }
    if (
      prevSchema.fields &&
      seatAmount !== getFieldValue(prevSchema.fields, 'Seat count per Row')
    ) {
      updateSeatingNodes();
    }
  }

  useEffect(() => {
    if (didMount) {
      updateSeatingNodes();
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
            x: containerRef.current.x(),
            y: containerRef.current.y(),
          });
        }}
        draggable={!isCustomerMode}
        x={x}
        y={y}
        ref={containerRef}
        onClick={onSelect}
        onTap={onSelect}
        width={containerWidth}
        height={containerHeight}
        rotation={rotation}
      >
        {renderRowLabels()}
        {seatNodesRefs.current.map((seat, idx) => {
          if (seatAmount === idx) return null;
          const currentRefs = seatNodesRefs.current;
          const konvaId = (currentRefs[idx] && currentRefs[idx]._id) || null;
          const shapeSelectables = seatsSelected || [];
          const ticketGroupId = schema.seatMap[idx];
          const ticketGroupColor =
            ticketGroupId && ticketGroupMap[ticketGroupId]
              ? ticketGroupMap[ticketGroupId].color
              : undefined;
          const seatColor =
            isCustomerMode && !ticketGroupColor ? 'black' : ticketGroupColor;
          const seatLabel = getRowSeatLabel(idx % seatCountPerRow);

          return (
            <SeatNode
              seatLabel={seatLabel}
              seatMapIndex={idx}
              seatId={idx}
              isSelected={shapeSelectables.some(shape => konvaId === shape._id)}
              isSelectable={isCustomerMode && ticketGroupId}
              onClick={onSeatSelect}
              onDidMount={handleSeatNodesMounted}
              ticketGroupId={ticketGroupId}
              seatMapObjectId={id}
              seatColor={seatColor}
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

AssignSeatingSection.defaultProps = {
  isCustomerMode: false,
};

AssignSeatingSection.propTypes = {
  schema: PropTypes.object,
  redrawParent: PropTypes.func,
  onSelect: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  seatsSelected: PropTypes.arrayOf(PropTypes.object),
  onUpdateSeatRefs: PropTypes.func,
  ticketGroupMap: PropTypes.object,
  isCustomerMode: PropTypes.bool,
  onSeatSelect: PropTypes.func,
};

export default AssignSeatingSection;
