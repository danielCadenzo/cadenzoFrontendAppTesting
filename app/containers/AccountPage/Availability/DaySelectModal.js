import React, { useCallback, useState } from 'react';
import Modal from 'components/Modal';
import SlotDetailForm from './SlotDetailForm';

function SlotDetailModal({
  isOpen,
  onSubmit,
  onClose,
  slotDetail,
  profileDefaultLocation,
  profileIsArtist = { profileIsArtist },
}) {
  return (
    <Modal isOpen={isOpen} header="Add Show Slot" onClose={onClose}>
      <SlotDetailForm
        onClose={onClose}
        onSubmit={onSubmit}
        slotDetail={slotDetail}
        profileIsArtist={profileIsArtist}
        profileDefaultLocation={profileDefaultLocation}
      />
    </Modal>
  );
}

SlotDetailModal.defaultProps = {
  readOnly: true,
};

SlotDetailModal.propTypes = {};

export default SlotDetailModal;
