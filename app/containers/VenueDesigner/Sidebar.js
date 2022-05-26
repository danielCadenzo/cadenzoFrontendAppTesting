import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import * as RequestStates from 'redux/RequestStates';
import MapSidebar from './MapSidebar';
import LoadingSpinner from './LoadingSpinner';
import CheckmarkIcon from './CheckmarkIcon';
import EditingModeTypes from './EditingModeTypes';
import TicketTierSidebar from './TicketTierSidebar';

const SidebarWrapper = styled.div`
  background: #4b4d63;
  width: 300px;
  min-width: 300px;
`;

const SidebarTab = styled.button`
  margin-top: 12px;
  padding: 12px;
  width: 100%;
  color: white;
  border: 1px solid white;
  background-color: ${({ isActive = false }) =>
    isActive ? '#1D82A5' : 'inherit'};
`;

const Sidebar = ({
  addVenueNode,
  editorSaveRequestState,
  selectedItemMap,
  mapName,
}) => {
  const [selectedTab, updateSelectedTab] = useState(EditingModeTypes.Maps);
  const renderAutoSaveButton = () => {
    if (editorSaveRequestState === RequestStates.REQUESTED) {
      return (
        <React.Fragment>
          <p className="f5 work-sans-black mr-3 color-white">Saving</p>{' '}
          <LoadingSpinner width="24px" height="24px" />
        </React.Fragment>
      );
    }
    if (
      editorSaveRequestState === RequestStates.SUCCEEDED ||
      editorSaveRequestState === RequestStates.UNINITIALIZED
    ) {
      return (
        <div className="d-flex flex-justify-center">
          <p className="f5 work-sans-black mr-3 color-white">Saved</p>
          <CheckmarkIcon width="16px" height="16px" />
        </div>
      );
    }
    return null;
  };

  const renderSelectedTab = () => {
    switch (selectedTab) {
      case EditingModeTypes.Tiers:
        return (
          <TicketTierSidebar
            activelySelectedSeats={selectedItemMap}
            addVenueNode={addVenueNode}
          />
        );
      case EditingModeTypes.Maps:
        return <MapSidebar addVenueNode={addVenueNode} />;
      default:
        return <MapSidebar addVenueNode={addVenueNode} />;
    }
  };

  const handleTabSelect = e => {
    const {
      target: { value },
    } = e;
    if (value === selectedTab) return null;
    switch (value) {
      case EditingModeTypes.Tiers:
        updateSelectedTab(EditingModeTypes.Tiers);
        break;
      case EditingModeTypes.Maps:
        updateSelectedTab(EditingModeTypes.Maps);
        break;
      default:
        return null;
    }
    return null;
  };

  return (
    <SidebarWrapper className="d-flex flex-column">
      <div className="d-flex flex-justify-between flex-items-center text-center mt-2 mx-2">
        <p className="h3 work-sans-black color-white">{mapName}</p>
        {renderAutoSaveButton()}{' '}
      </div>
      <div className="d-flex border-gray-light flex-justify-around">
        <SidebarTab
          value={EditingModeTypes.Maps}
          onClick={handleTabSelect}
          isActive={EditingModeTypes.Maps === selectedTab}
          className="border-gray-light f5 mx-2"
        >
          Map{' '}
        </SidebarTab>
        <SidebarTab
          onClick={handleTabSelect}
          value={EditingModeTypes.Tiers}
          isActive={EditingModeTypes.Tiers === selectedTab}
          className="border-gray-light f5 mx-2"
        >
          Tiers
        </SidebarTab>
      </div>
      {renderSelectedTab()}
    </SidebarWrapper>
  );
};

Sidebar.propTypes = {
  addVenueNode: PropTypes.func.isRequired,
  selectedItemMap: PropTypes.array,
  mapName: PropTypes.string.isRequired,
  editorSaveRequestState: PropTypes.string,
};

export default Sidebar;
