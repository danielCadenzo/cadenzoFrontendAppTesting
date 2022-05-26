import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import Table from 'components/Table';
import editIcon from 'images/icons/edit.svg';
import Grid from '@material-ui/core/Grid';
import trashIcon from '../../images/icons/trash.svg';
import IconButton from '../../components/IconButton';
import ConfirmDialog from './ConfirmDialog';

function TicketTable(props) {
  const { selectedEvent, onEditTicketGroup, onDeleteTicketGroup } = props;
  const [showConfirmDialog, updateShowDialog] = useState(false);
  const [ticketId, updateticketId] = useState(null);

  const ticketGroups = selectedEvent.productGroups.edges;

  const deleteTicketGroup = () => {
    onDeleteTicketGroup(ticketId);
    updateShowDialog(false);
  };

  const showConfirmationDialog = (isOpen = false, selectedTicketGrp) => {
    updateShowDialog(isOpen);
    updateticketId(selectedTicketGrp.node.id);
  };

  const amountTicketsSold = () =>
    ticketGroups.reduce((acc, edge) => edge.node.amtSold, 0);
  const ticketTotal = () =>
    ticketGroups.reduce((acc, edge) => edge.node.ticketAmt, 0);

  const totalRevenue = () =>
    ticketGroups.reduce(
      (acc, edge) => edge.node.ticketAmt * edge.node.amtSold,
      0,
    );
  const columns = [
    {
      Header: 'Name',
      accessor: grp => grp.node.name,
      id: 'node.name',
    },
    {
      Header: 'Amount',
      accessor: grp => grp.node.ticketAmt,
      id: 'node.ticketAmt',
    },
    {
      Header: 'Sold',
      accessor: grp => grp.node.amtSold,
      id: 'node.amtSold',
    },
    {
      Header: () => (
        <div className="d-flex" style={{ visibility: 'hidden' }}>
          <IconButton /> <IconButton />
        </div>
      ),
      id: 'node.id',
      accessor: row => (
        <div className="d-flex">
          <IconButton
            className="pl-2"
            icon={editIcon}
            onClick={() => onEditTicketGroup(true, row)}
            {...row}
          />{' '}
          <IconButton
            className="mx-2"
            icon={trashIcon}
            onClick={() => showConfirmationDialog(true, row)}
            {...row}
          />
        </div>
      ),
    },
  ];
  if (!selectedEvent) return null;

  return (
    <>
      <Table
        data={ticketGroups}
        columns={columns}
        footerContent={
          <Grid container justify="space-around">
            <p className="work-sans-black"> {ticketTotal()} Total</p>
            <p className="work-sans-black"> {amountTicketsSold()} Sold</p>
            <p className="work-sans-black">
              Gross Revenue: ${totalRevenue().toFixed(2)}{' '}
            </p>
          </Grid>
        }
      />
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onConfirm={deleteTicketGroup}
        onCancel={() => updateShowDialog(false)}
        onClose={() => updateShowDialog(false)}
      />
    </>
  );
}

TicketTable.propTypes = {
  onEditTicketGroup: PropTypes.func,
  onDeleteTicketGroup: PropTypes.func,
  selectedEvent: PropTypes.object,
};

export default memo(TicketTable);
