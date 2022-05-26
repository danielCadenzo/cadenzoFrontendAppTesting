'use es6';

/**
 *
 * VenueDesigner
 *
 */

import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect, ReactReduxContext } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage, injectIntl } from 'react-intl';
import { compose } from 'redux';
import styled, { createGlobalStyle } from 'styled-components';
import { Stage, Layer, Group, Rect } from 'react-konva';
import * as VenueDesignerActions from 'redux/actions/VenueDesignerActions';
import { createStructuredSelector } from 'reselect';
import {
  getVenueItemNodes,
  getSelectedMapNodeId,
  getEditorSaveRequestState,
  getVenueSelectOptions,
  getTicketTierMapping,
  getVenueMapName,
} from 'data/selectors/venueDesignerSelectors';
import { getEmail } from 'data/selectors/authSelectors';
import { useDidMount } from 'utils/customHooks';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { updateDrag, getItemsInHitBox } from 'utils/konvaUtils';
import Sidebar from './Sidebar';
import GASection from './GASection';
import TableNode from './TableNode';
import * as GraphNodeTypes from './GraphNodeTypes';
import LabelNode from './LabelNode';
import AssignSeatingSection from './AssignSeatingSection';
import EditModeTypes from './EditingModeTypes';
import ChooseVenueModal from './ChooseVenueModal';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  flex: 0 0 100%;
  background-color: #fafafa;
`;

const DraggableContainer = styled.div`
  border: 2px solid gray;
  height: 100%;
  height: ${({ height }) => `${height}px`} !important;
  width: 100%;
  width: ${({ width }) => `${width}px`} !important;
`;

const GriddedStage = styled(Stage)`
  background-size: 40px 40px;
  background-image: linear-gradient(to right, grey 1px, transparent 1px),
    linear-gradient(to bottom, grey 1px, transparent 1px);
`;

const GlobalStyle = createGlobalStyle`
.konvajs-content canvas {
    background-size: ${({ scale }) =>
    `${20 * scale}px ${20 * scale}px !important`};
    background-image: linear-gradient(to right, #d1d1d1 1px, transparent 1px),
    linear-gradient(to bottom, #d1d1d1 1px, transparent 1px) !important;
  }
`;

const ZoomButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 80px;
  height: 100px;
  position: fixed !important;
  z-index: 100;
  background-color: white;
  margin: 12px;
`;

const ZoomButton = styled.button`
  width: 100%;
  height: 100%;
  cursor: pointer !important;
`;

export function VenueDesigner({
  addVenueNode,
  venueItems,
  updateVenueItem,
  selectMapNode,
  selectedNodeId,
  editorSaveRequestState,
  venueSelectOptions,
  createVenueMap,
  ticketGroupMapping,
  fetchVenueDesignerOptions,
  userEmail,
  loadVenueMap,
  venueMapName,
}) {
  const [stagetDimensions, updateStageDimensions] = useState({
    width: 200,
    height: 200,
  });
  const didMount = useDidMount();
  const stageRef = useRef(null);
  const [stageScale, updateStageScale] = useState(1);
  const [showModal, updateShowModal] = useState(true);
  const [currentMode, updateCurrentMode] = useState('');
  const [selectablesRefMap, updateSelectablesRefMap] = useState({});
  const [selectedItemMap, updateSelectedItemMap] = useState([]);
  const [isShiftKeyDown, updateIsShiftKeyDown] = useState(false);

  const [editMode, updateEditModee] = useState('Map');
  const boundingBoxRef = useRef();
  const [boundingBoxProps, updateBoundingBoxProps] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    visible: false,
    stroke: 'red',
    dash: [2, 2],
    posStart: {
      x: null,
      y: null,
    },
    posNow: {},
  });

  const toggleSelectVenueMapModal = () => {
    updateShowModal(!showModal);
  };

  const handleCreateNewVenueMap = mapName => {
    if (mapName !== '') {
      createVenueMap(mapName);
      toggleSelectVenueMapModal();
    }
  };

  const handleLoadVenueMap = mapId => {
    if (mapId !== '') {
      loadVenueMap(mapId);
      toggleSelectVenueMapModal();
    }
  };

  const handleEditingModeChange = evnt => {
    const {
      currentTarget: { value },
    } = evnt;
    if (EditModeTypes[value] || true) {
      updateEditModee(value);
    }
  };

  const checkDeselect = e => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectMapNode(null);
    }
  };

  const clearSelectedItemMap = () => {
    const newKeys = {
      ...Object.keys(selectedItemMap).reduce(
        (currVal, val) => ({
          ...currVal,
          [val]: [],
        }),
        selectedItemMap,
      ),
    };
    updateSelectedItemMap({ ...newKeys });
    updateBoundingBoxProps({
      ...boundingBoxProps,
    });
    onRedrawParent();
  };

  const onRedrawParent = () => {
    if (stageRef.current) stageRef.current.draw();
  };

  const handleMouseDown = e => {
    if (e.evt.shiftKey) {
      updateIsShiftKeyDown(true);
      updateCurrentMode('drawing');
      // Get Start Drag Position
      const posIn = { x: e.evt.layerX, y: e.evt.layerY };
      // update Bounding Box positions
      updateBoundingBoxProps({
        ...boundingBoxProps,
        posStart: { x: posIn.x, y: posIn.y },
        posNow: { x: posIn.x, y: posIn.y },
      });
    } else {
      updateIsShiftKeyDown(false);
    }
    checkDeselect(e);
  };

  // Gets the MapObject Revelent Nodes for hitbox checks
  const handleNodePositionsRefUpdate = (nodeObjectId, selectableItems) => {
    updateSelectablesRefMap({
      ...selectablesRefMap,
      [nodeObjectId]: selectableItems,
    });
  };

  const handleHighlightSelection = () => {
    if (editMode === EditModeTypes.Tiers || true) {
      let finallSelectMap = { ...selectedItemMap };
      Object.keys(selectablesRefMap).forEach(nodeId => {
        const selectables = selectablesRefMap[nodeId];
        const selectedItems = getItemsInHitBox(
          boundingBoxRef.current,
          selectables,
        );
        finallSelectMap = {
          ...finallSelectMap,
          [nodeId]: selectedItems,
        };
      });
      updateSelectedItemMap(finallSelectMap);
    }
  };

  const handleMouseMove = e => {
    if (currentMode === 'drawing' && e.evt.shiftKey) {
      const posNow = { x: e.evt.layerX, y: e.evt.layerY };
      const boundingRef = boundingBoxRef.current;
      updateDrag(
        posNow,
        boundingRef,
        venueItems,
        boundingBoxProps,
        updateBoundingBoxProps,
      );
    }
  };

  const handleMouseUp = e => {
    if (currentMode !== 'drawing') clearSelectedItemMap();
    if (currentMode === 'drawing') handleHighlightSelection();
    updateCurrentMode('');
    updateBoundingBoxProps({
      ...boundingBoxProps,
      visible: false,
    });
    onRedrawParent();
  };

  const handleNodeChange = updatedNode => {
    updateVenueItem(updatedNode);
  };

  const fitStageIntoParentContainer = () => {
    const container = document.querySelector('#konva-container');
    updateStageDimensions({
      width: container.offsetWidth,
      // Minus the navbar height
      height: container.offsetHeight - 48,
    });
  };

  const renderCorrectNode = item => {
    const { type } = item;
    const seatsSelected = selectedItemMap[item.id] || [];
    switch (type) {
      case GraphNodeTypes.ASSIGNED_SEATING_SECTION: {
        return (
          <AssignSeatingSection
            key={item.id}
            schema={item}
            isSelected={item.id === selectedNodeId}
            onSelect={() => {
              selectMapNode(item.id);
            }}
            onChange={handleNodeChange}
            redrawParent={onRedrawParent}
            onUpdateSeatRefs={handleNodePositionsRefUpdate}
            seatsSelected={seatsSelected}
            ticketGroupMap={ticketGroupMapping}
          />
        );
      }
      case GraphNodeTypes.GA_SECTION: {
        return (
          <GASection
            key={item.id}
            schema={item}
            isSelected={item.id === selectedNodeId}
            onSelect={() => {
              selectMapNode(item.id);
            }}
            onChange={handleNodeChange}
            seatsSelected={seatsSelected}
            onUpdateSeatRefs={handleNodePositionsRefUpdate}
            redrawParent={onRedrawParent}
            ticketGroupMap={ticketGroupMapping}
          />
        );
      }
      case GraphNodeTypes.TABLE: {
        return (
          <TableNode
            key={item.id}
            schema={item}
            isSelected={item.id === selectedNodeId}
            onSelect={() => {
              selectMapNode(item.id);
            }}
            onChange={handleNodeChange}
            seatsSelected={seatsSelected}
            onUpdateSeatRefs={handleNodePositionsRefUpdate}
            ticketGroupMap={ticketGroupMapping}
          />
        );
      }
      case GraphNodeTypes.LABEL: {
        return (
          <LabelNode
            key={item.id}
            schema={item}
            isSelected={item.id === selectedNodeId}
            onSelect={() => {
              selectMapNode(item.id);
            }}
            onChange={handleNodeChange}
          />
        );
      }
      default:
        return null;
    }
  };

  useEffect(() => {
    if (didMount) {
      fitStageIntoParentContainer();
      fetchVenueDesignerOptions(userEmail);
    }
  }, [didMount]);

  const { width, height } = stagetDimensions;

  return (
    <Wrapper>
      <GlobalStyle scale={stageScale} />
      <Helmet>
        <title>Venue Designer</title>
        <meta name="description" content="Description of VenueDesigner" />
      </Helmet>
      <ZoomButtonContainer className="shadow">
        <ZoomButton
          className="border-bottom"
          disabled={stageScale > 1.6}
          onClick={() => {
            if (stageRef.current) {
              const newScaleValue = stageScale + 0.2;
              const newScale = { x: newScaleValue, y: newScaleValue };
              stageRef.current.scale(newScale);
              updateStageScale(newScaleValue);
            }
          }}
        >
          <AddIcon />
        </ZoomButton>
        <ZoomButton
          className="border-top"
          disabled={stageScale < 0.21}
          onClick={() => {
            if (stageRef.current) {
              const newScaleValue = stageScale - 0.2;
              const newScale = { x: newScaleValue, y: newScaleValue };
              stageRef.current.scale(newScale);
              updateStageScale(newScaleValue);
            }
          }}
        >
          <RemoveIcon />
        </ZoomButton>
      </ZoomButtonContainer>
      <DraggableContainer id="konva-container">
        <ReactReduxContext.Consumer className="full-width full-height">
          {/* consume store from context */}
          {({ store }) => (
            <GriddedStage
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={checkDeselect}
              width={width * 4}
              draggable={!isShiftKeyDown}
              height={height * 4}
              ref={stageRef}
            >
              <Layer>
                {venueItems.map(item => renderCorrectNode(item))}
                <Group draggable>
                  <Rect
                    id="bounding-box"
                    {...boundingBoxProps}
                    listening={false}
                    ref={boundingBoxRef}
                    dash={[2, 2]}
                    dashEnabled
                  />
                </Group>
              </Layer>
            </GriddedStage>
          )}
        </ReactReduxContext.Consumer>
      </DraggableContainer>
      {showModal && (
        <ChooseVenueModal
          showModal={showModal}
          toggleSelectVenueMapModal={toggleSelectVenueMapModal}
          handleCreateNewVenueMap={handleCreateNewVenueMap}
          venueSelectOptions={venueSelectOptions}
          handleLoadVenueMap={handleLoadVenueMap}
        />
      )}
      <Sidebar
        addVenueNode={addVenueNode}
        mapName={venueMapName}
        editorSaveRequestState={editorSaveRequestState}
        onChangeEditorMode={handleEditingModeChange}
        selectedItemMap={selectedItemMap}
      />
    </Wrapper>
  );
}

VenueDesigner.propTypes = {
  addVenueNode: PropTypes.func.isRequired,
  updateVenueItem: PropTypes.func.isRequired,
  venueItems: PropTypes.array,
  selectMapNode: PropTypes.func.isRequired,
  selectedNodeId: PropTypes.string,
  editorSaveRequestState: PropTypes.string.isRequired,
  venueSelectOptions: PropTypes.array.isRequired,
  ticketGroupMapping: PropTypes.object,
  venueMapName: PropTypes.string.isRequired,
  userEmail: PropTypes.string.isRequired,
  loadVenueMap: PropTypes.func.isRequired,
  createVenueMap: PropTypes.func.isRequired,
  fetchVenueDesignerOptions: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  addVenueNode: VenueDesignerActions.addVenueItem,
  updateVenueItem: VenueDesignerActions.updateVenueItem,
  selectMapNode: VenueDesignerActions.updateSelectedNode,
  createVenueMap: VenueDesignerActions.createVenueMap,
  fetchVenueDesignerOptions: VenueDesignerActions.venueDesignerItems,
  loadVenueMap: VenueDesignerActions.loadVenueMap,
};

const mapStateToProps = createStructuredSelector({
  venueItems: getVenueItemNodes(),
  selectedNodeId: getSelectedMapNodeId(),
  editorSaveRequestState: getEditorSaveRequestState(),
  venueSelectOptions: getVenueSelectOptions(),
  ticketGroupMapping: getTicketTierMapping(),
  userEmail: getEmail(),
  venueMapName: getVenueMapName(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(injectIntl(VenueDesigner));
