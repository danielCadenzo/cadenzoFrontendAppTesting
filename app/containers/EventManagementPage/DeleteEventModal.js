import React, { useState } from 'react';
import Modal from 'components/Modal';
import H4 from 'components/H4';
import Button from 'components/Button';
import { TextField } from '@material-ui/core';
import styled from 'styled-components';

const StyledInput = styled(TextField)`
  & input {
    font-size: 28px;
    color: red;
  }
`;

function DeleteEventModal({ isOpen, onConfirm, onClose }) {
  const [value, updateValue] = useState('');

  const handleOnChange = ({ target: { value } }) => updateValue(value);
  const isConfirmDisabled = value.toLowerCase() !== 'delete';

  return (
    <Modal isOpen={isOpen} header="Delete This Event" onClose={onClose}>
      <H4 className="mt-3">Delete This Event?</H4>
      <p className="work-sans-black my-2">
        Type the word 'delete', to delete this Event
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
          Delete Event
        </Button>
      </div>
    </Modal>
  );
}

export default DeleteEventModal;
