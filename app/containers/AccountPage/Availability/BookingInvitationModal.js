import React, { useEffect, useState, useMemo } from 'react';
import Modal from 'components/Modal';
import Button from 'components/Button';
import { createGQLQuery } from 'data/api';
import { createUUID } from 'utils/helpers';
import BookingInvitationRow from './BookingInvitationRow';

const GET_INVITATIONS = `
{
  viewer {
    invitations{
      profileId
      extraData
      email
    	invitationType
      id
      isAccepted
    }
  }`;

function BookingInvitationModal({ isOpen, onClose }) {
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = () =>
    createGQLQuery(GET_INVITATIONS, {}).then(data => {
      if (data.invitations) {
        setInvitations(data.invitations.edges);
      }

      return setInvitations();
    });

  const onRemoveInvitation = index => {
    const newAdmins = [...invitations];
    newAdmins.splice(index, 1);
    setInvitations([...newAdmins]);
  };

  const onAddInvitation = () => {
    const newAdmins = [...invitations];
    setInvitations([...newAdmins, { id: createUUID() }]);
  };

  const handleClose = useMemo(() => onClose(false), ['static']);

  return (
    <Modal isOpen={isOpen} header="Booking Invitations" onClose={handleClose}>
      <Button onClick={onAddInvitation}>Create</Button>
      <div className="p-5">
        {invitations.map(invite => (
          <BookingInvitationRow
            onDelete={onRemoveInvitation}
            bookingInvitation={invite.node}
          />
        ))}
        <div className="d-flex py-4 flex-justify-end" />
      </div>
    </Modal>
  );
}

export default BookingInvitationModal;
