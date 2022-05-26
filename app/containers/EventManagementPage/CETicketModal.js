import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Input from 'components/Input';
import H4 from 'components/H4';
import Checkbox from '@material-ui/core/Checkbox';
import Select from 'components/AsyncSelect';
import { createGQLQuery } from 'data/api';
import { USER_SEARCH_BY_EMAIL } from 'queries/User';
import { TextField, Box, Button } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import { DataGrid } from '@material-ui/data-grid';

const TextArea = styled.textarea`
  display: flex;
  flex-align-items: center;
  flex-justify-content: center;
  min-width: 300px;
  min-height: 150px;
`;

const TicketInput = styled(TextField)`
  & input {
    text-align: center;
    max-width: 48px;
  }
`;

const RevokeButton = styled(Button)`
  color: #f57c00 !important;
  border-color: #f57c00 !important;
`;

function CETicketModal(props) {
  const {
    onClose,
    onEditEvent,
    onUpdateTicketHolder,
    onAddTicketHolder,
    ticketGroup,
    ticketHolders,
  } = props;
  const {
    basePrice,
    description,
    id,
    ticketAmt,
    isMarketplaceAllowed,
    maxMarkupPrice,
    name: title,
  } = ticketGroup;
  const [form, setFormData] = useState({
    basePrice: basePrice || '',
    ticketAmt: ticketAmt || '',
    ticketId: id,
    isMarketplaceAllowed: !!isMarketplaceAllowed,
    maxMarkupPrice: null,
    description: description || '',
    title,
    holds: [],
  });
  const [searchValue, setSearchValue] = useState(undefined);

  const columns = [
    {
      field: 'cover_img',
      headerName: ' ',
      width: 'fit-content',
      minWidth: '48px',
      renderCell: (...row) => <PersonIcon />,
    },
    { field: 'email', headerName: 'Email', width: '60%' },
    {
      field: 'amountHeld',
      headerName: 'Amount Held',
      width: '100%',
      renderCell: row => {
        const { data } = row;
        const { email, amountHeld = 0 } = data;
        return (
          <Box display="flex" alignItems="center" justify="center">
            <TicketInput
              onChange={onUpdateTicketHolder}
              value={amountHeld}
              placeholder="# of Tickets"
            />
            <RevokeButton variant="outlined" className="ml-2" size="small">
              Revoke
            </RevokeButton>
          </Box>
        );
      },
    },
  ];

  const handleValueChange = (key, value) => {
    setFormData({ ...form, [key]: value });
  };

  const handleUserSelected = option => {
    if (!option) return null;
    // make sure user doesn't already exist
    const holdIndex = ticketHolders.findIndex(
      (val, index) => option.value === val.email,
    );
    setSearchValue('');
    setSearchValue(null);
    if (holdIndex === -1 && typeof option === 'object') {
      const { amountHeld = 0 } = option;
      onAddTicketHolder({ ...option, amountHeld });
    }
  };

  // TODO: Debounce Method on Type
  const onSearchUser = (event, optionCallback) => {
    let searchValue = '';
    if (event) {
      searchValue = event.target.value;
    }
    createGQLQuery(USER_SEARCH_BY_EMAIL, { search: searchValue }).then(data => {
      const { users } = data;
      // pass back users as options
      optionCallback(
        users.edges.map(userNode => ({
          label: userNode.node.email,
          value: userNode.node.email,
          avatar: userNode.node.avatar,
          amountHeld: userNode.node.amountHeld,
          ...userNode.node,
        })),
      );
    });
  };

  const handleSave = () => {
    const { onCreateTicket, onEditTicket } = props;
    const {
      basePrice,
      ticketAmt,
      ticketId,
      isMarketplaceAllowed,
      maxMarkupPrice,
      title,
      description,
    } = form;
    if (!Number.isNaN(basePrice) && ticketAmt && title) {
      if (ticketId) {
        onEditTicket(form);
      } else {
        onCreateTicket(form);
      }
    }
  };

  return (
    <div className="pb-3">
      <div className="d-flex flex-justify-center pt-4">
        <div className="d-flex full-width">
          <div className="d-flex flex-column">
            <H4 className="py-2">Ticket Group Name</H4>
            <Input
              defaultValue={title}
              onChange={e => handleValueChange('title', e.target.value)}
              placeholder="Enter Name"
            />

            <H4 className="py-2">Price</H4>
            <Input
              type="number"
              defaultValue={basePrice}
              onChange={e =>
                handleValueChange(
                  'basePrice',
                  Number.parseFloat(e.target.value),
                )
              }
              placeholder="Enter Price for Tickets"
            />
            <div className="d-flex py-2">
              <div className="d-flex flex-column">
                <H4 className="py-2">Amount</H4>
                <Input
                  disabled={ticketAmt}
                  type="number"
                  onChange={e =>
                    handleValueChange(
                      'ticketAmt',
                      Number.parseInt(e.target.value),
                    )
                  }
                  placeholder="Enter Amount"
                  defaultValue={form.ticketAmt}
                />
              </div>
            </div>

            <div className="d-flex flex-items-center">
              <H4 className="py-2">Marketplace Allowed</H4>
              <Checkbox
                checked={form.isMarketplaceAllowed}
                onChange={e =>
                  handleValueChange('isMarketplaceAllowed', e.target.checked)
                }
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            </div>
            <div className="d-flex flex-column">
              <H4 className="py-2">Description</H4>
              <TextArea
                className="p-1"
                type="text"
                value={form.description}
                onChange={e => handleValueChange('description', e.target.value)}
                placeholder="Enter Event Description (Markdown supported)"
              />
            </div>
          </div>
          <div className="d-flex flex-column full-width ml-3 mt-2">
            <h3 className="f3 work-sans-black"> Manage Ticket Holds</h3>
            <Select
              onChange={handleUserSelected}
              placeholder="Search Email to Hold Tickets"
              value={searchValue}
              variant="standard"
              onSearchChange={onSearchUser}
              clearOnSelect
            />
            <div className="mt-3" style={{ height: 300, width: '100%' }}>
              <DataGrid rows={ticketHolders} columns={columns} pageSize={5} />
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex flex-justify-end pt-4">
        <Button className="mr-1" onClick={onClose}>
          {' '}
          Cancel
        </Button>
        <Button onClick={handleSave}> Save</Button>
      </div>
    </div>
  );
}

CETicketModal.propTypes = {
  ticket_group: PropTypes.object,
  onClose: PropTypes.func,
  onEditTicket: PropTypes.func.isRequired,
  onCreateTicket: PropTypes.func.isRequired,
  basePrice: PropTypes.oneOfType([PropTypes.number]),
  isMarketplaceAllowed: PropTypes.bool,
  onUpdateTicketHolder: PropTypes.func.isRequired,
  maxMarkupPrice: PropTypes.number,
};

CETicketModal.defaultProps = {
  isMarketplaceAllowed: false,
  maxMarkupPrice: null,
  ticketGroup: {
    basePrice: '',
    description: '',
    id: '',
    description: '',
    ticketAmt: 0,
    isMarketplaceAllowed: false,
    maxMarkupPrice: undefined,
    title: '',
  },
};

export default memo(CETicketModal);
