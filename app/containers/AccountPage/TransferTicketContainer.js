'use es6';

import React, { useCallback } from 'react';
import { useForm } from 'react-form';
import InputField from 'components/Form/InputField';
import Button from 'components/Button';
import PropTypes from 'prop-types';
import Label from 'components/Form/Label';
import H2 from 'components/H2';
import { createGQLQuery } from 'data/api';

const TRASNFER_TICKET = `
mutation($ticketId: ID!,  $email: String!){
  transferTicket(id:$ticketId,  email: $email ){
    success
  }
}`;

export default function TransferTicketContainer({
  onClose,
  onHasBeenTransferred,
  ticketId,
  userEmail,
}) {
  const handleSubmit = useCallback((values, instance) => {
    const { email } = values;
    if (instance.meta.isValid && userEmail !== email) {
      createGQLQuery(TRASNFER_TICKET, { email, ticketId }).then(data => {
        // onHasBeenTransferred(ticketId);
        onClose();
      });
    }
  }, []);

  const { Form, setFieldValue } = useForm({
    onSubmit: handleSubmit,
  });

  const transferTicket = useCallback(() => {}, []);

  return (
    <div
      className="d-flex flex-column p-3"
      style={{ backgroundColor: '#e4e4e4' }}
    >
      <H2 className="py-2">Transfer Tickets</H2>
      <Form>
        <div className="d-flex flex-column">
          <Label>Email</Label>
          <InputField required type="email" name="email" />
        </div>
        <div className="d-flex flex-justify-end pt-3">
          <Button onClick={transferTicket} type="submit">
            {' '}
            Send{' '}
          </Button>
          <Button type="button" onClick={onClose} inverted>
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
}

TransferTicketContainer.propTypes = {
  onClose: PropTypes.func.isRequired,
  onHasBeenTransferred: PropTypes.func.isRequired,
  userEmail: PropTypes.string.isRequired,
  ticketId: PropTypes.string.isRequired,
};
