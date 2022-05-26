'use es6';

import React, { useRef, useEffect } from 'react';
import { Group, Text } from 'react-konva';
import { useDidMount } from 'utils/customHooks';
import PropTypes from 'prop-types';
import { getFieldValue } from './utils';

function LabelNode({
  schema,
  getRef,
  onClick,
  seatId,
  onDidMount,
  onSelect,
  isCustomerMode,
  label,
  size,
  ...rest
}) {
  const textRef = useRef();
  const { x, y, fields } = schema;
  const textLabel = getFieldValue(fields, 'Label') || label;
  const fontSize = getFieldValue(fields, 'Font Size') || size;
  const rotation = getFieldValue(fields, 'Rotation') || 0;

  const didMount = useDidMount();

  useEffect(() => {
    if (didMount) {
      if (onDidMount) onDidMount();
    }
  }, [didMount]);

  const handleOnClick = () => {
    if (onClick) {
      onClick(seatId);
    }
  };

  return (
    <Group
      x={x}
      y={y}
      ref={r => {
        getRef(r);
      }}
      onClick={onSelect || handleOnClick}
      draggable={!isCustomerMode}
      onTap={onSelect}
      rotation={rotation}
      {...rest}
    >
      <Text
        ref={textRef}
        text={textLabel}
        fill="black"
        fontSize={fontSize}
        align="center"
      />
    </Group>
  );
}

LabelNode.propTypes = {
  seatLabel: PropTypes.string,
  getRef: PropTypes.func,
  label: PropTypes.string,
  size: PropTypes.number,
  geometryProps: PropTypes.objectOf({
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
  }),
  isCustomerMode: PropTypes.bool,
  onDidMount: PropTypes.func,
  schema: PropTypes.object,
  onClick: PropTypes.func,
  seatId: PropTypes.string,
  onSelect: PropTypes.func,
};

LabelNode.defaultProps = {
  geometryProps: {
    width: 15,
    x: 100,
    y: 100,
  },
  label: '',
  getRef: () => {},
  size: 15,
  isCustomerMode: false,
};

export default LabelNode;
