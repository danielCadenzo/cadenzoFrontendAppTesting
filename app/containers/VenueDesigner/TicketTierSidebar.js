import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import { createUUID } from 'containers/VenueDesigner/utils';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  getTicketTierMapping,
  getVenueItemMap,
  getTicketGroupSeatCount,
} from 'data/selectors/venueDesignerSelectors';
import { createStructuredSelector } from 'reselect';
import * as VenueDesignerActions from 'redux/actions/VenueDesignerActions';
import { COLOR_SWATCHES } from './constants';
import * as GraphNodeTypes from './GraphNodeTypes';
import TicketTier from './TicketTier';

const TicketTierSidebar = ({
  ticketTierMapping,
  activelySelectedSeats,
  updateTicketTierSeating,
  venueItemMap,
  updateTicketTierInfo,
  deleteTicketTier,
  ticketTierSeatCount,
}) => {
  const addTicketGroup = () => {
    const tierListLength = Object.keys(ticketTierMapping).length;
    const colorSwatch =
      tierListLength >= COLOR_SWATCHES.length
        ? COLOR_SWATCHES[Math.floor(Math.random() * COLOR_SWATCHES.length - 1)]
        : COLOR_SWATCHES[tierListLength];

    const tierId = createUUID();
    updateTicketTierInfo(tierId, {
      name: `Tier ${tierListLength + 1}`,
      seatMapping: {},
      id: tierId,
      color: colorSwatch,
      price: 10.0,
    });
  };

  const onDeleteTicketGroup = id => {
    deleteTicketTier(id);
  };

  // Adds the seating for a map node to a ticket tier
  const handleAddSeatingForTier = id => {
    const updatedSeatMap = {};
    Object.keys(activelySelectedSeats).forEach(mapNodeId => {
      const mapNode = venueItemMap[mapNodeId];
      const selectables = activelySelectedSeats[mapNodeId];
      updatedSeatMap[mapNodeId] = {};
      if (mapNode.type === GraphNodeTypes.ASSIGNED_SEATING_SECTION) {
        selectables.forEach(selectableNode => {
          updatedSeatMap[mapNodeId][selectableNode.name()] = id;
        });
      }
      if (mapNode.type === GraphNodeTypes.TABLE) {
        selectables.forEach(selectableNode => {
          updatedSeatMap[mapNodeId][selectableNode.name()] = id;
        });
      }
      if (mapNode.type === GraphNodeTypes.GA_SECTION) {
        selectables.forEach(() => {
          updatedSeatMap[mapNodeId]['0'] = id;
        });
      }
    });

    updateTicketTierSeating(updatedSeatMap);
  };

  const onUpdateTierLabel = (id, value) => {
    updateTicketTierInfo(id, {
      ...ticketTierMapping[id],
      name: value,
    });
  };

  const onUpdateTierPrice = (id, value) => {
    updateTicketTierInfo(id, {
      ...ticketTierMapping[id],
      price: parseFloat(value),
    });
  };

  const renderTicketGroups = () =>
    Object.values(ticketTierMapping).map(({ name, price, color, id }) => (
      <TicketTier
        label={name}
        color={color}
        price={price}
        seatsAreSelected={!!Object.keys(activelySelectedSeats).length}
        onUpdateSeatCount={() => handleAddSeatingForTier(id)}
        onDeleteTier={() => onDeleteTicketGroup(id)}
        seatAmount={ticketTierSeatCount[id]}
        onPriceChange={e => {
          onUpdateTierPrice(id, e.target.value);
        }}
        onNameChange={e => {
          onUpdateTierLabel(id, e.target.value);
        }}
      />
    ));

  return (
    <div className="d-flex flex-column">
      <div className="d-flex mt-3 flex-justify-center">
        <Button onClick={addTicketGroup} fullWidth={false}>
          Add Ticket Group
        </Button>
      </div>
      {renderTicketGroups()}
    </div>
  );
};

TicketTierSidebar.propTypes = {
  ticketTierMapping: PropTypes.object.isRequired,
  activelySelectedSeats: PropTypes.object,
  updateTicketTierSeating: PropTypes.func.isRequired,
  updateTicketTierInfo: PropTypes.func.isRequired,
  venueItemMap: PropTypes.object.isRequired,
  deleteTicketTier: PropTypes.func.isRequired,
  ticketTierSeatCount: PropTypes.number,
};

const mapDispatchToProps = {
  deleteTicketTier: VenueDesignerActions.deleteTicketTier,
  updateTicketTierSeating: VenueDesignerActions.updateTicketTierSeating,
  updateTicketTierInfo: VenueDesignerActions.updateTicketTierInfo,
};

const mapStateToProps = createStructuredSelector({
  ticketTierMapping: getTicketTierMapping(),
  venueItemMap: getVenueItemMap(),
  ticketTierSeatCount: getTicketGroupSeatCount(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(TicketTierSidebar);
