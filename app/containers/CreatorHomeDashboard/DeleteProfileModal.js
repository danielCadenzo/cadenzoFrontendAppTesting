import React, { useState } from 'react';
import Modal from 'components/Modal';
import H4 from 'components/H4';
import Button from 'components/Button';
import { TextField } from '@material-ui/core';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

const StyledInput = styled(TextField)`
  & input {
    font-size: 28px;
    color: red;
  }
`;

function DeleteProfileModal({ isOpen, onConfirm, onClose }) {
  const [value, updateValue] = useState('');

  const handleOnChange = ({ target: { value } }) => updateValue(value);
  const isConfirmDisabled = value.toLowerCase() !== 'delete';

  return (
    <Modal isOpen={isOpen} header="Delete Profile" onClose={onClose}>
      <H4 className="mt-3">Delete This Profile?</H4>
      <p className="text-gray f5 py-3">
        <FormattedMessage {...messages.adminModalHelp} />
      </p>
      <p className="my-2">
        Type the word 'delete', to delete this Profile. This <b>cannot</b> be
        undone
      </p>
      <StyledInput className="f-3" onChange={handleOnChange} type="text" />
      <div className="d-flex py-4 flex-justify-end">
        <Button className="mr-2" onClick={onClose}>
          Cancel
        </Button>
        <Button
          inverted={isConfirmDisabled}
          disabled={isConfirmDisabled}
          onClick={onConfirm}
        >
          Delete Profile
        </Button>
      </div>
    </Modal>
  );
}

export default DeleteProfileModal;
