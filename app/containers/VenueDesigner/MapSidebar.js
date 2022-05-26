import React, { useState } from 'react';
import styled from 'styled-components';
import TableChartIcon from '@material-ui/icons/TableChart';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import EditForm from './EditForm';
import messages from './messages';
import * as GraphNodeTypes from './GraphNodeTypes';

const SECTION = 'SECTION';

const NodeOptionButton = styled.button`
  background: white;
  color: #22af9a;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  padding: 12px;

  &:hover {
    background-color: #22af9a;
    color: white;

    & > svg {
      color: white !important;
    }
  }
`;
const MapSidebar = ({ addVenueNode }) => {
  const [showAddNodeTypeWindow, updateShowAddNodeTypeWindow] = useState(false);
  const [generalNodeTypeSelected, updateGeneralNodeTypeSelected] = useState(
    null,
  );

  const handleAddNodeType = evnt => {
    const {
      currentTarget: { value },
    } = evnt;
    updateShowAddNodeTypeWindow(false);
    addVenueNode(value);
  };

  const handleMultiOptionClick = evnt => {
    const {
      currentTarget: { value },
    } = evnt;
    if (value === SECTION) {
      updateGeneralNodeTypeSelected(value);
      updateShowAddNodeTypeWindow(true);
    }
  };

  const renderAddOptionsForNodeType = () => {
    if (!showAddNodeTypeWindow) return null;
    if (generalNodeTypeSelected === SECTION) {
      return (
        <Paper className="p-2 mt-2">
          <div className="d-flex flex-justify-around">
            <NodeOptionButton
              value={GraphNodeTypes.GA_SECTION}
              onClick={handleAddNodeType}
            >
              <FormattedMessage {...messages.generalAdmission} />
            </NodeOptionButton>

            <NodeOptionButton
              value={GraphNodeTypes.ASSIGNED_SEATING_SECTION}
              onClick={() =>
                addVenueNode(GraphNodeTypes.ASSIGNED_SEATING_SECTION)
              }
            >
              <FormattedMessage {...messages.assignedSeating} />
            </NodeOptionButton>
          </div>
        </Paper>
      );
    }
    return null;
  };

  return (
    <div className="d-flex flex-column">
      <div className="d-flex mt-3 flex-justify-around">
        <NodeOptionButton onClick={handleMultiOptionClick} value={SECTION}>
          <TableChartIcon style={{ color: '#22AF9A' }} />
          <FormattedMessage {...messages.section} />
        </NodeOptionButton>
        <NodeOptionButton onClick={() => addVenueNode(GraphNodeTypes.TABLE)}>
          <TableChartIcon style={{ color: '#22AF9A' }} />
          <FormattedMessage {...messages.table} />
        </NodeOptionButton>
        {false && (
          <NodeOptionButton>
            <TableChartIcon style={{ color: '#22AF9A' }} />
            <FormattedMessage {...messages.icon} />
          </NodeOptionButton>
        )}
        <NodeOptionButton onClick={() => addVenueNode(GraphNodeTypes.LABEL)}>
          <TableChartIcon style={{ color: '#22AF9A' }} />
          <FormattedMessage {...messages.label} />
        </NodeOptionButton>
      </div>
      {renderAddOptionsForNodeType()}
      <EditForm />
    </div>
  );
};

MapSidebar.propTypes = {
  addVenueNode: PropTypes.func.isRequired,
};

export default MapSidebar;
