import React from 'react';
import Modal from 'components/Modal';
import PropTypes from 'prop-types';
import OverrideModalForm from './OverrideModalForm';
/**
 * The only purpose is to add overrides
 */
function OverrideModal({
  isOpen,
  onSubmit,
  onClose,
  profileDefaultLocation,
  profileIsArtist,
}) {
  return (
    <Modal isOpen={isOpen} header="Add Show Slot" onClose={onClose}>
      <OverrideModalForm
        onSubmit={onSubmit}
        profileDefaultLocation={profileDefaultLocation}
        profileIsArtist={profileIsArtist}
        onClose={onClose}
      />
    </Modal>
  );
}

OverrideModal.propTypes = {
  isOpen: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  profileDefaultLocation: PropTypes.any,
  profileIsArtist: PropTypes.bool,
};

export default OverrideModal;
