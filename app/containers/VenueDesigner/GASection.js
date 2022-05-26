'use es6';

import React, { useEffect } from 'react';
import { Group, Rect, Text, Transformer, Image } from 'react-konva';
import { useDidMount, useImage } from 'utils/customHooks';
import PropTypes from 'prop-types';
import FootprintIcon from 'images/icons/footprints.png';
import EventSeatIcon from 'images/icons/event_seat.png';
import { getFieldValue } from './utils';
import * as IconTypes from './IconTypes';

const GASection = ({
  schema,
  isSelected,
  onSelect,
  onChange,
  onUpdateSeatRefs,
  ticketGroupMap,
  isCustomerMode,
}) => {
  const {
    x,
    y,
    width,
    height,
    background = { width: 150, height: 100 },
    fields,
    id,
    seatMap,
  } = schema;
  const { width: backgroundWidth, height: backgroundHeight } = background;
  const textLabel = getFieldValue(fields, 'Section Label');
  const showLabel = getFieldValue(fields, 'Show Section Label');
  const showIcon = getFieldValue(fields, 'Show Icon');
  const iconToRender = getFieldValue(fields, 'Icon');

  const shapeProps = { x, y, width, height };
  const textRef = React.useRef();
  const shapeRef = React.useRef();
  const transformerRef = React.useRef();
  const groupRef = React.useRef();
  const didMount = useDidMount();
  const [footprintIcon] = useImage(FootprintIcon);
  const [eventSeatIcon] = useImage(EventSeatIcon);

  const [positionAnchor, updateAnchor] = React.useState({});
  const [iconAnchor, updateIconAnchor] = React.useState({});

  const getTicketGroupColor = () => {
    // eslint-disable-next-line no-prototype-builtins
    if (seatMap['0'] && ticketGroupMap.hasOwnProperty(seatMap['0'])) {
      return ticketGroupMap[seatMap['0']].color;
    }
    return null;
  };

  const updateTextCentering = () => {
    const {
      x: rectPositionX,
      y: rectPositionY,
      width: groupWidth,
      height: groupHeight,
    } = shapeRef.current.getSelfRect();
    const textWidth = textRef.current.width();
    let textHeight = textRef.current.height();
    // use the text Height to position the icon
    // eslint-disable-next-line no-self-assign
    if (showIcon) textHeight = textHeight;
    const paddingH = groupWidth > textWidth ? (groupWidth - textWidth) / 2 : 0;
    const paddingV =
      groupHeight > textHeight ? (groupHeight - textHeight) / 2 : 0;
    updateAnchor({
      x: paddingH + rectPositionX,
      y: rectPositionY + paddingV - 10,
    });
  };

  const handleSeatRefUpdate = () => {
    if (onUpdateSeatRefs && id) onUpdateSeatRefs(id, [shapeRef.current]);
  };

  const updateIconPosition = () => {
    const {
      // eslint-disable-next-line no-unused-vars
      x: rectPositionX,
      y: rectPositionY,
      width: groupWidth,
      height: groupHeight,
    } = shapeRef.current.getSelfRect();
    const paddingV = groupHeight > 30 ? (groupHeight - 30) / 2 : 0;
    const newRootPosition = rectPositionY + paddingV;
    updateIconAnchor({
      y: showLabel ? newRootPosition + 15 : newRootPosition,
      x: (groupWidth - 30) / 2,
    });
  };

  const getSectionIcon = () => {
    switch (iconToRender) {
      case IconTypes.FOOTPRINT:
        return footprintIcon;
      case IconTypes.EVENT_SEAT:
        return eventSeatIcon;
      default:
        return footprintIcon;
    }
  };

  const updateAllPositions = () => {
    updateTextCentering();
    updateIconPosition();
    handleSeatRefUpdate();
  };

  useEffect(() => {
    if (didMount) {
      updateAllPositions();
    } else {
      handleSeatRefUpdate();
    }
  }, [didMount]);

  React.useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const fillColor = getTicketGroupColor();

  return (
    <React.Fragment>
      <Group
        onDragEnd={() => {
          onChange({
            ...schema,
            ...shapeProps,
            x: groupRef.current.x(),
            y: groupRef.current.y(),
          });
          updateAllPositions();
        }}
        draggable={!isCustomerMode}
        x={x}
        y={y}
        ref={groupRef}
        onClick={onSelect}
        onTap={onSelect}
      >
        <Rect
          fill={fillColor || '#e8e8e8'}
          stroke={isSelected ? '#fac113' : '#a8a8a8'}
          shadowBlur={1}
          ref={shapeRef}
          height={backgroundHeight}
          width={backgroundWidth}
          onTransformEnd={() => {
            // transformer is changing scale of the node
            // and NOT its width or height
            // but in the store we have only width and height
            // to match the data better we will reset scale on transform end
            const node = shapeRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();

            // we will reset it back
            node.scaleX(1);
            node.scaleY(1);
            onChange({
              ...schema,
              background: {
                width: Math.max(5, node.width() * scaleX),
                height: Math.max(node.height() * scaleY),
              },
            });
            updateAllPositions();
          }}
        />
        <Text
          text={showLabel ? textLabel : ''}
          ref={textRef}
          fontSize={15}
          padding={10}
          align="center"
          {...positionAnchor}
        />
        {showIcon && (
          <Image
            image={getSectionIcon()}
            width={30}
            height={30}
            {...iconAnchor}
          />
        )}
      </Group>
      {isSelected && (
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

GASection.defaultProps = {
  isCustomerMode: false,
};

GASection.propTypes = {
  schema: PropTypes.object,
  isSelected: PropTypes.func,
  onSelect: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  isCustomerMode: PropTypes.bool,
  onUpdateSeatRefs: PropTypes.func.isRequired,
  ticketGroupMap: PropTypes.object.isRequired,
  seatsSelected: PropTypes.array,
};

export default GASection;
