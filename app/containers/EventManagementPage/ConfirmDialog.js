import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Modal from 'components/Modal';

function ConfirmDialog(props) {
  const { onClose } = props;
  return (
    <Modal header={props.header} isOpen={props.isOpen} onClose={onClose}>
      <div>
        <h3>Are sure you want to delete the tickets for this event?</h3>
        <div className="d-flex">
          <Button onClick={props.onCancel}> Cancel </Button>
          <Button onClick={props.onConfirm}> Confirm </Button>
        </div>
      </div>
    </Modal>
  );
}

ConfirmDialog.propTypes = {
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
  header: PropTypes.string,
};

export default ConfirmDialog;
