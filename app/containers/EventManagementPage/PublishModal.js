import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Modal from 'components/Modal';

function ConfirmDialog({ isOpen, onClose, onConfirm }) {
  return (
    <Modal header="Publish Event?" isOpen={isOpen} onClose={onClose}>
      <div>
        <h3 className="f3 py-4 work-sans-black">
          Are you sure you want publish this event? Once published, only general
          admission tickets can be created and the venue map{' '}
          <b className="text-bold">CANNOT</b> be changed for the event except
          for ticket information and pricing.
        </h3>
        <div className="d-flex mt-3">
          <Button onClick={onClose}> Cancel </Button>
          <Button onClick={onConfirm}> Confirm </Button>
        </div>
      </div>
    </Modal>
  );
}

ConfirmDialog.propTypes = {
  onConfirm: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
};

export default ConfirmDialog;
