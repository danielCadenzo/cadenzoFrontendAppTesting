'use es6';

import React, { useRef, useEffect } from 'react';
import { Group, Text, Circle } from 'react-konva';
import { useDidMount } from 'utils/customHooks';
import PropTypes from 'prop-types';

function SeatNode({
  geometryProps,
  seatLabel,
  getRef,
  onClick,
  onDidMount,
  isSelected,
  isSelectable,
  seatMapIndex,
  ticketGroupId,
  seatMapObjectId,
  seatColor = '#e8e8e8',
}) {
  const textRef = useRef();
  const circleRef = useRef();
  const { width, x, y } = geometryProps;
  const [positionAnchor, updateAnchor] = React.useState({ x: 100, y: 100 });

  const updateTextCentering = () => {
    const {
      x: rectPositionX,
      y: rectPositionY,
      width: groupWidth,
      height: groupHeight,
    } = circleRef.current.getSelfRect();
    const { x, y } = positionAnchor;
    const textWidth = textRef.current.width();
    const textHeight = textRef.current.height();
    let paddingH = groupWidth > textWidth ? (groupWidth - textWidth) / 2 : 0;
    const paddingV =
      groupHeight > textHeight ? (groupHeight - textHeight) / 2 : 0;
    if (seatLabel && seatLabel.length > 1) paddingH -= seatLabel.length * 2;
    if (x !== paddingH + rectPositionX || y === rectPositionY + paddingV) {
      updateAnchor({
        x: paddingH + rectPositionX,
        y: rectPositionY + paddingV,
      });
    }
  };

  const didMount = useDidMount();

  useEffect(() => {
    if (didMount) {
      updateTextCentering();
      if (onDidMount) onDidMount(seatMapIndex);
    } else {
      updateTextCentering();
    }
  }, [didMount]);

  const handleOnClick = () => {
    if (onClick && textRef.current && isSelectable) {
      onClick(textRef.current.parent, {
        ticketGroupId,
        seatMapIndex,
        seatMapObjectId,
      });
    }
  };
  return (
    <Group
      x={x}
      y={y}
      ref={r => {
        getRef(r);
      }}
      onClick={handleOnClick}
      onTap={handleOnClick}
      name={`${seatMapIndex}`}
    >
      <Circle
        radius={width}
        ref={circleRef}
        fill={seatColor || '#e8e8e8'}
        stroke={isSelected ? '#fac113' : '#a8a8a8'}
        strokeWidth={3}
      />
      <Text
        ref={textRef}
        text={seatLabel}
        fill="black"
        fontSize={15}
        align="center"
        {...positionAnchor}
        padding={10}
      />
    </Group>
  );
}

SeatNode.propTypes = {
  seatLabel: PropTypes.string,
  getRef: PropTypes.func,
  isSelectable: PropTypes.bool,
  seatColor: PropTypes.string,
  isSelected: PropTypes.bool,
  geometryProps: PropTypes.objectOf({
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
  }),
  ticketGroupId: PropTypes.string,
  seatMapIndex: PropTypes.string,
  seatMapObjectId: PropTypes.string,
  onClick: PropTypes.func,
  onDidMount: PropTypes.func,
};

SeatNode.defaultProps = {
  geometryProps: {
    width: 15,
    x: 100,
    y: 100,
  },
  getRef: () => {},
  isSelected: false,
  seatColor: '#e8e8e8',
  isSelectable: false,
  ticketGroupId: null,
};

export default SeatNode;
