import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import H4 from 'components/H4';
import Modal from 'components/Modal';
import { FormattedMessage } from 'react-intl';
import Table from 'components/Table';
import messages from './messages';
import trashIcon from '../../images/icons/trash.svg';
import IconButton from '../../components/IconButton';

function CEMembershipModal(props) {
  const { onClose, isOpen, membership, onSave } = props;
  let events = { edges: [] };
  if (membership) events = membership.events;

  let schema = {
    membershipType: '',
    price: 0,
    name: '',
    autoAdd: false,
    eventIds: [],
  };

  if (membership) {
    schema = {
      membershipType: membership.membershipType || '',
      price: membership.price || '',
      name: membership.name,
      autoAdd: membership.autoAddEvents || false,
      eventIds: membership.events.edges.map(evtNode => evtNode.node.id),
    };
  }

  const [form, setFormData] = useState(schema);

  const header = membership ? (
    <FormattedMessage {...messages.editMembership} />
  ) : (
    <FormattedMessage {...messages.addMembership} />
  );

  const removeEventFromMembership = id => {
    setFormData({ ...form, eventIds: form.eventIds.filter(e => e !== id) });
  };

  const updateForm = (evt, key) => {
    setFormData({ ...form, [key]: evt.target.value });
  };

  events.edges = events.edges.filter(e =>
    form.eventIds.some(id => {
      for (const evnt of events.edges) {
        if (id === evnt.node.id) return true;
      }
    }),
  );

  const onHandleSave = () => {
    const eventsForMembership = events.edges.map(e => e.node.databaseId);
    if (membership) {
      onSave({
        id: membership.id,
        events: eventsForMembership,
        price: form.price,
        name: form.name,
      });
    } else {
      onSave(form);
    }
  };

  return (
    <Modal modalWidth="80%" isOpen={isOpen} header={header} onClose={onClose}>
      <div className="d-flex  full-width">
        <div className="d-flex  full-width flex-column my-2">
          <H4>Name</H4>
          <input
            defaultValue={form.name}
            placeholder="Event Name"
            onChange={e => {
              updateForm(e, 'name');
            }}
          />

          <div className="d-flex flex-items-center my-2">
            <H4 className="mr-2">Price:</H4>
            <input
              defaultValue={form.price}
              placeholder="Price"
              onChange={e => {
                updateForm(e, 'price');
              }}
            />
          </div>
          <div className="d-flex flex-items-center my-2">
            <H4 className="mr-2">
              <b>Auto-Add Newly Created Events:</b>
            </H4>
            <input
              checked={form.autoAdd}
              onChange={e => {
                e.target.value = e.target.value === 'on';
                updateForm(e, 'autoAdd');
              }}
              type="checkbox"
            />
          </div>
          <H4 className="mb-1">Membership Type:</H4>
          <div
            className="d-flex flex-items-center my-2"
            onChange={e => {
              updateForm(e, 'membershipType');
            }}
          >
            <input
              checked={form.membershipType === 'SEASONAL'}
              type="radio"
              name="membershipType"
              value="SEASONAL"
            />
            <h5 className="mx-2">Seasonal</h5>
            <input
              checked={form.membershipType === 'SUBSCRIPTION'}
              className="ml-3"
              type="radio"
              name="membershipType"
              value="SUBSCRIPTION"
            />{' '}
            <h5 className="mx-2">Subscription</h5>
          </div>
        </div>

        <div className="d-flex full-width flex-column mx-2 align-items-center p-3">
          <Table
            data={events.edges || []}
            filterAccessor="name"
            columns={[
              {
                Header: 'Events In Membership',
                accessor: event => event.node.title,
                id: 'title',
              },
              {
                Header: '',
                id: 'id',
                accessor: row => (
                  <div className="d-flex">
                    <IconButton
                      className="mx-2"
                      icon={trashIcon}
                      onClick={e => removeEventFromMembership(row.node.id)}
                      {...props}
                    />
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>

      <div className="d-flex flex-justify-end">
        <Button onClick={onClose}> Cancel</Button>
        <Button onClick={onHandleSave}> Save</Button>
      </div>
    </Modal>
  );
}

CEMembershipModal.propTypes = {
  membership: PropTypes.object,
  onClose: PropTypes.func,
  isOpen: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default memo(CEMembershipModal);
