/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect, ReactReduxContext } from 'react-redux';
import { compose } from 'redux';
import styled, { createGlobalStyle } from 'styled-components';
import { getVenueMapName } from 'data/selectors/venueDesignerSelectors';
import { createStructuredSelector } from 'reselect';
import { getEmail } from 'data/selectors/authSelectors';
import { useDidMount } from 'utils/customHooks';
import { Stage, Layer } from 'react-konva';
import ZoomController from 'containers/VenueDesigner/ZoomController';
import * as GraphNodeTypes from './GraphNodeTypes';
import LabelNode from './LabelNode';
import AssignSeatingSection from './AssignSeatingSection';
import GASection from './GASection';
import TableNode from './TableNode';

const STAGE_HEIGHT_AND_WIDTH = 300;

const DraggableContainer = styled.div`
  border: 2px solid gray;
  height: 100%;
  height: ${({ height }) => `${height}px`} !important;
  max-height: 300px;
  width: 100%;
  overflow: hidden !important;
  position: relative;
`;

const GriddedStage = styled(Stage)`
  background-size: 40px 40px;
  background-image: linear-gradient(to right, grey 1px, transparent 1px),
    linear-gradient(to bottom, grey 1px, transparent 1px);
`;

const GlobalStyle = createGlobalStyle`
.konvajs-content canvas {
  }
`;

/**
 * The Customer Venue Map which allows seats to be selected for purchase
 * TODO: Connect purchases to update the venue map to seats available
 */
function CustomerVenueMap({
  ticketGroupMapping,
  venueItems,
  onUpdateSeatsSelected,
}) {
  const [stagetDimensions, updateStageDimensions] = useState({
    width: 200,
    height: 200,
  });
  const didMount = useDidMount();
  const stageRef = useRef(null);
  const [stageScale, updateStageScale] = useState(1);
  const [selectablesRefMap, updateSelectablesRefMap] = useState({});
  const [selectedSeats, updateSelectedSeats] = useState({});

  const handleNodePositionsRefUpdate = (nodeObjectId, selectableItems) => {
    updateSelectablesRefMap({
      ...selectablesRefMap,
      [nodeObjectId]: selectableItems,
    });
  };

  const handleSeatSelect = (
    seatInfo,
    { ticketGroupId, seatMapIndex, seatMapObjectId },
  ) => {
    if (selectedSeats[seatInfo._id]) {
      delete selectedSeats[seatInfo._id];
      updateSelectedSeats({ ...selectedSeats });
      onUpdateSeatsSelected(ticketGroupId, {
        ticketGroupId,
        seatMapIndex,
        seatMapObjectId,
      });
    } else {
      updateSelectedSeats({
        ...selectedSeats,
        [seatInfo._id]: seatInfo,
      });
      onUpdateSeatsSelected(ticketGroupId, {
        ticketGroupId,
        seatMapIndex,
        seatMapObjectId,
      });
    }
  };

  const renderCorrectNode = item => {
    const { type } = item;
    const seatsSelected = Object.values(selectedSeats);
    switch (type) {
      case GraphNodeTypes.ASSIGNED_SEATING_SECTION: {
        return (
          <AssignSeatingSection
            key={item.id}
            schema={item}
            isCustomerMode
            redrawParent={onRedrawParent}
            seatsSelected={seatsSelected}
            onSeatSelect={handleSeatSelect}
            onUpdateSeatRefs={handleNodePositionsRefUpdate}
            ticketGroupMap={ticketGroupMapping}
          />
        );
      }
      case GraphNodeTypes.GA_SECTION: {
        return (
          <GASection
            key={item.id}
            schema={item}
            isCustomerMode
            seatsSelected={seatsSelected}
            redrawParent={onRedrawParent}
            onUpdateSeatRefs={handleNodePositionsRefUpdate}
            ticketGroupMap={ticketGroupMapping}
          />
        );
      }
      case GraphNodeTypes.TABLE: {
        return (
          <TableNode
            key={item.id}
            schema={item}
            isCustomerMode
            seatsSelected={seatsSelected}
            onSeatSelect={handleSeatSelect}
            onUpdateSeatRefs={handleNodePositionsRefUpdate}
            ticketGroupMap={ticketGroupMapping}
          />
        );
      }
      case GraphNodeTypes.LABEL: {
        return <LabelNode isCustomerMode key={item.id} schema={item} />;
      }
      default:
        return null;
    }
  };

  const onRedrawParent = () => {
    if (stageRef.current) stageRef.current.draw();
  };

  const fitStageIntoParentContainer = () => {
    const container = document.querySelector('#konva-container');
    updateStageDimensions({
      width: container.offsetWidth,
      // Minus the navbar height
      height: container.offsetHeight - 48,
    });
  };

  useEffect(() => {
    if (didMount) {
      fitStageIntoParentContainer();
    }
  }, [didMount]);

  useEffect(() => {
    let minX = 0;
    let maxX = 0;
    let minY = 0;
    let maxY = 0;
    Object.values(venueItems).forEach(item => {
      const { x, y } = item;
      if (x < minX) {
        minX = x;
      }
      if (x > maxX + (item.width || 0)) {
        maxX = x;
        maxX += item.width || 0;
      }
      if (x < minY) {
        minY = y;
      }
      if (x > maxY) {
        maxY = y;
        maxY += item.height || 0;
      }
    });

    const mapWidth = Math.abs(minX - maxX);
    const mapHeight = Math.abs(minY - maxY);

    const biggestDifference = Math.max(mapWidth, mapHeight);
    if (biggestDifference === 0) updateStageScale(1);
    else {
      const newScale = STAGE_HEIGHT_AND_WIDTH / biggestDifference;
      stageRef.current.offsetX(minX);
      stageRef.current.offsetY(minY);
      stageRef.current.scale({ x: newScale, y: newScale });
      redrawStage();
      updateStageScale(newScale);
    }
  }, [venueItems]);

  const redrawStage = () => {
    stageRef.current.draw();
  };

  const onIncreaseScale = () => {
    const newScale = stageScale + 0.2;
    updateStageScale(newScale);
    stageRef.current.scale({ x: newScale, y: newScale });
    redrawStage();
  };

  const onDecreaseScale = () => {
    const newScale = stageScale - 0.2;
    updateStageScale(newScale);
    stageRef.current.scale({ x: newScale, y: newScale });
    redrawStage();
  };

  return (
    <div>
      <GlobalStyle scale={stageScale} />
      <DraggableContainer
        height={STAGE_HEIGHT_AND_WIDTH}
        width={stagetDimensions.width}
        id="konva-container"
      >
        <ZoomController
          onIncreaseClick={onIncreaseScale}
          onDecreaseClick={onDecreaseScale}
        />
        <ReactReduxContext.Consumer className="full-width full-height">
          {/* consume store from context */}
          {() => (
            <GriddedStage
              width={STAGE_HEIGHT_AND_WIDTH * 4}
              height={STAGE_HEIGHT_AND_WIDTH * 4}
              ref={stageRef}
              draggable
            >
              <Layer>
                {Object.values(venueItems).map(item => renderCorrectNode(item))}
              </Layer>
            </GriddedStage>
          )}
        </ReactReduxContext.Consumer>
      </DraggableContainer>
    </div>
  );
}

CustomerVenueMap.propTypes = {
  venueItems: PropTypes.object,
  ticketGroupMapping: PropTypes.object,
  onUpdateSeatsSelected: PropTypes.func.isRequired,
};

const mapDispatchToProps = {};

const mapStateToProps = createStructuredSelector({
  userEmail: getEmail(),
  venueMapName: getVenueMapName(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(CustomerVenueMap);
