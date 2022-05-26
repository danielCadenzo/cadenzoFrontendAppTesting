import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import { Button, TextField } from '@material-ui/core';
import Modal from 'components/Modal';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import messages from './messages';

const TableWrapper = styled(TableContainer)`
  margin-bottom: 12px;
  min-height: 300px;
  max-height: 400px;
  overflow-y: auto;
  max-width: 600px;
`;

const RevenueTable = styled.div`
  border: 1px gray solid;
  border-radius: 8px;
  min-height: 300px;
  max-height: 400px;
  min-width: 350px;
`;

const LimitedHeightTable = styled(Table)`
  max-height: 300px;
`;

const ChooseVenueModal = ({
  showModal,
  toggleSelectVenueMapModal,
  handleCreateNewVenueMap,
  venueSelectOptions,
  handleLoadVenueMap,
}) => {
  const [tempMapName, updateTempMapName] = useState('');

  return (
    <Modal
      isOpen={showModal}
      onClose={toggleSelectVenueMapModal}
      header={<FormattedMessage {...messages.selectVenueMap} />}
      modalWidth="80%"
    >
      <div className="d-flex py-3 flex-wrap flex-justify-around">
        <div className="d-flex flex-column">
          <h4 className="work-sans-black f3 mb-3">
            <FormattedMessage {...messages.chooseVenue} />
          </h4>
          <div className="mb-3 d-flex flex-column">
            <TextField
              className="mr-3"
              placeholder="Enter Map Name"
              fullWidth={false}
              value={tempMapName}
              onChange={e => updateTempMapName(e.target.value)}
            >
              <FormattedMessage {...messages.create} />
            </TextField>
            <div className="flex-self-center mt-3">
              <Button
                onClick={() => handleCreateNewVenueMap(tempMapName)}
                fullWidth={false}
              >
                <FormattedMessage {...messages.create} />
              </Button>
            </div>
          </div>
        </div>

        <RevenueTable className="d-flex flex-column mr-2 ml-5 mb-2 mt-3">
          <TableWrapper>
            <LimitedHeightTable size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell> Map Name </TableCell>
                  <TableCell align="right" />
                </TableRow>
              </TableHead>
              <TableBody>
                {venueSelectOptions.map(row => (
                  <TableRow key={row.mapName}>
                    <TableCell component="th" scope="row">
                      {row.mapName}
                    </TableCell>
                    <TableCell align="right">
                      <Button onClick={() => handleLoadVenueMap(row.id)}>
                        Edit
                      </Button>
                      <Button className="ml-2">Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </LimitedHeightTable>
          </TableWrapper>
        </RevenueTable>
      </div>
    </Modal>
  );
};

ChooseVenueModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  toggleSelectVenueMapModal: PropTypes.func.isRequired,
  handleCreateNewVenueMap: PropTypes.func.isRequired,
  venueSelectOptions: PropTypes.array,
  handleLoadVenueMap: PropTypes.func.isRequired,
};

export default ChooseVenueModal;
