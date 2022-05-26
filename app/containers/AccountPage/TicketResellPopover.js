'use es6';

import React, { useCallback } from 'react';
import { useForm } from 'react-form';
import InputField from 'components/Form/InputField';
import Button from 'components/Button';
import PropTypes from 'prop-types';
import Label from 'components/Form/Label';
import H2 from 'components/H2';
import { createGQLQuery } from 'data/api';
import { SELL_TICKET } from './queries';

const MIN_PRICE = 100;

function TicketResellPopover({ onClose, onHasBeenTransferred, ticketId }) {
  const handleSubmit = useCallback((values, instance, ...rest) => {
    const { price } = values;
    const priceInPennies = Math.trunc(parseFloat(price) * 100);

    if (instance.meta.isValid && priceInPennies >= MIN_PRICE) {
      createGQLQuery(SELL_TICKET, {
        price: priceInPennies,
        ticketId,
        isOnMarketplace: true,
      }).then(data => {
        onClose();
      });
    }
  });

  const { Form, values } = useForm({
    onSubmit: handleSubmit,
  });

  return (
    <div
      className="d-flex flex-column p-3"
      style={{ backgroundColor: '#e4e4e4' }}
    >
      <H2 className="py-2">Sell Tickets</H2>
      <Form>
        <div className="d-flex flex-column">
          <Label className="f4">Marketplace Price</Label>
          <InputField
            required
            type="number"
            min="1.00"
            step="1.00"
            placeholder="Enter price (Min: $1.00)"
            name="price"
          />
        </div>
        <div className="d-flex flex-justify-end pt-3">
          <Button type="submit">Send</Button>
          <Button type="button" onClick={onClose} inverted>
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
}

TicketResellPopover.propTypes = {
  onClose: PropTypes.func.isRequired,
  onHasBeenTransferred: PropTypes.func.isRequired,
  ticketId: PropTypes.string.isRequired,
};

export default TicketResellPopover;
